"use client";

import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import TagInput from "../TagInput";
import ReqLabel from "../ReqLabel";
import Loading from "../Loading";
import supabase from "../../lib/supabase";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const { session } = useAuth();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const username = session?.user?.user_metadata?.username;

            const { error } = await supabase.from("posts").insert({
                title,
                content,
                tags,
                username,
                user_id: session.user.id,
                likes: [],
            });

            if (error) throw error;

            setTitle("");
            setContent("");
            setTags([]);
            setIsSuccess(true);
            setTimeout(() => router.replace("/"), 2000);
        } catch (error) {
            setIsError(true);
            setErrMsg(error.message || "Failed to create post");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSuccess(false);
            setIsError(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, [isSuccess, isError]);

    return !isLoading ? (
        <div
            className={`flex lg:h-5/6 lg:w-4/5 md:w-full md:h-full gap-12 justify-center items-center pl-6 pr-6`}
        >
            {isSuccess ? (
                <Notification msg={`SUCCESS!\nPost Created!`} color={`bg-primary`} />
            ) : isError ? (
                <Notification msg={`ERROR!\n${errMsg}`} color={`bg-rose-600`} />
            ) : (
                ""
            )}
            <div className={`flex flex-col gap-6 lg:w-1/2 md:w-3/4`}>
                <form className={`flex flex-col gap-6`} onSubmit={handleSubmit}>
                    <input
                        className={`bg-dark-black text-white pt-5 pb-5 pl-12 pr-12 w-full border-1 border-primary`}
                        placeholder="Enter post title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        className={`bg-dark-black text-white pt-5 pb-5 pl-12 pr-12 w-full border-1 border-primary`}
                        placeholder="Enter post content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    {content.length >= 10000 ? (
                        <ReqLabel iconName="report" color="text-red-500" req="Maximum Characters Limit Reached" />
                    ) : (
                        ""
                    )}
                    <TagInput tags={tags} setTags={(value) => setTags(value)} />
                    <div className={`flex justify-between flex-col md:flex-row gap-4`}>
                        <button
                            className={`text-black bg-primary text-xl pt-4 pb-4 pl-12 pr-12 active:bg-black active:text-primary`}
                            disabled={isLoading}
                        >
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <div className={`flex justify-center items-center h-screen`}>
            <Loading />
        </div>
    );
};

export default CreatePost;
