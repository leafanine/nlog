"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";
import LikeButton from "./LikeButton";
import Notification from "./Notification";
import Branding from "./Branding";
import { formatDate } from "./DateFormatter";


const DetailedFeed = () => {
    const params = useParams();
    const router = useRouter();
    const postId = params.id;
    const { session } = useAuth();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isError, setError] = useState(false);
    const [notification, setNotification] = useState({ msg: "", color: "" });

    const getPost = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", postId)
                .single();

            if (error || !data) {
                setError(true);
            } else {
                setPost(data);
            }
        } catch (err) {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const deletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from("posts")
                .delete()
                .eq("id", postId);

            if (error) throw error;

            setNotification({ msg: "SUCCESS!\nPost Deleted!", color: "bg-primary" });
            setTimeout(() => {
                router.replace("/");
            }, 2000);
        } catch (err) {
            setNotification({ msg: `ERROR!\n${err.message}`, color: "bg-rose-600" });
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        getPost();
    }, []);

    const firstLetter = post?.content?.trim().slice(0, 1).toUpperCase() ?? "";
    const isAuthor = session?.user?.id === post?.user_id;

    return (
        <>
            {notification.msg && <Notification msg={notification.msg} color={notification.color} />}
            {isLoading ? (
                <div className={`flex justify-center items-center h-screen`}>
                    <Loading />
                </div>
            ) : isError || !post ? (
                <div className={`h-screen flex justify-center items-center`}>
                    <h1 className={`text-white text-center text-2xl`}>Post not found</h1>
                </div>
            ) : (
                <div className={`flex flex-col lg:p-16 p-6 gap-4`}>
                    <h1 className={`text-primary text-4xl font-semibold`}>{post.title}</h1>

                    <div
                        className={`flex border-b-1 pb-5 border-gray-700 flex-col md:flex-row md:justify-between gap-4 md:gap-0`}
                    >
                        <div>
                            <p className={`text-dark-gray`}>written by @{post.username}</p>
                            <p className={`text-dark-gray`}>on {formatDate(post.created_at)}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <LikeButton post={post} postId={postId} />
                            {isAuthor && (
                                <button
                                    onClick={deletePost}
                                    disabled={isDeleting}
                                    className={`text-white bg-rose-600 md:text-lg text-sm pt-2 pb-2 pl-6 pr-6 rounded-sm active:bg-black active:text-rose-600 flex gap-2 items-center justify-center disabled:opacity-40`}
                                >
                                    <i className={`material-symbols-rounded`}>delete</i>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            )}
                        </div>
                    </div>

                    <p className={`text-white break-words whitespace-pre-wrap`}>
                        <span className={`text-4xl`}>{firstLetter}</span>
                        {post.content.trim().slice(1)}
                    </p>

                    <Branding />
                </div>
            )}
        </>
    );
};

export default DetailedFeed;
