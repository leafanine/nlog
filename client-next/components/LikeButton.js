"use client";

import { useState } from "react";
import useAuth from "../hooks/useAuth";
import supabase from "../lib/supabase";

const LikeButton = ({ post, postId }) => {
    const { session } = useAuth();
    const userId = session?.user?.id;
    const [isLoading, setIsLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(
        post.likes?.includes(userId) ?? false
    );

    const updateLikes = async () => {
        if (!userId || isLiked) return;
        setIsLoading(true);
        try {
            const { error } = await supabase.rpc("like_post", {
                p_post_id: postId,
                p_user_id: userId,
            });
            if (!error) setIsLiked(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return session ? (
        <button
            className={`text-black bg-primary md:text-lg text-sm pt-2 pb-2 pl-6 pr-6 rounded-sm active:bg-black active:text-primary flex gap-2 items-center justify-center disabled:opacity-40 disabled:active:bg-primary disabled:active:text-black`}
            disabled={isLiked || isLoading}
            onClick={updateLikes}
        >
            {isLoading ? (
                <>
                    <i className={`material-symbols-rounded animate-spin`}>next_plan</i>
                    Liking
                </>
            ) : (
                <>
                    <i className={`material-symbols-rounded`}>favorite</i>
                    {isLiked ? "Liked" : "Like"}
                </>
            )}
        </button>
    ) : (
        ""
    );
};

export default LikeButton;
