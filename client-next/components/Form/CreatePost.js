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
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const { session } = useAuth();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrMsg("Image size should be less than 5MB");
                setIsError(true);
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const username = session?.user?.user_metadata?.username;
            let image_url = null;

            // 1. Upload image if exists
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${session.user.id}/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('post-images')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('post-images')
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            // 2. Insert post with image_url
            const { error } = await supabase.from("posts").insert({
                title,
                content,
                tags,
                username,
                user_id: session.user.id,
                likes: [],
                image_url: image_url
            });

            if (error) throw error;

            setTitle("");
            setContent("");
            setTags([]);
            setImage(null);
            setImagePreview(null);
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

                    {/* Image Upload Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-dark-gray text-sm">Upload Cover Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={`text-white p-2 w-full border-1 border-primary bg-dark-black`}
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-auto max-h-[300px] object-contain border-1 border-primary mt-2 animate-in zoom-in-95 duration-300"
                            />
                        )}
                    </div>

                    <textarea
                        className={`bg-dark-black text-white pt-5 pb-5 pl-12 pr-12 w-full border-1 border-primary min-h-[200px]`}
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
                            className={`text-black bg-primary text-xl pt-4 pb-4 pl-12 pr-12 active:bg-black active:text-primary transition-colors`}
                            disabled={isLoading}
                        >
                            {isLoading ? "UPLOADING..." : "SUBMIT"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <div className={`flex justify-center items-center h-screen`}>
            <div className="flex flex-col items-center gap-4">
                <Loading />
                <p className="text-primary animate-pulse text-lg">Creating your post...</p>
            </div>
        </div>
    );
};

export default CreatePost;
