"use client";

import { useEffect, useState, useRef } from "react";

import Feed from "../../components/Feed";
import Navbar from "../../components/Navbar";
import supabase from "../../lib/supabase";
import getMonthAndDay from "../../utils/getMonthAndDay";
import { BottomScrollListener } from "react-bottom-scroll-listener";
import Loading from "../../components/Loading";
import PersistLogin from "../../components/PersistLogin";
import Branding from "../../components/Branding";


import useAuth from "../../hooks/useAuth";

const PAGE_SIZE = 4;

const Popular = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { session } = useAuth();
    const loadingRef = useRef(false);


    const getPosts = async (currentPage) => {
        if (!hasMore || loadingRef.current) return;
        loadingRef.current = true;
        setIsLoading(true);

        try {
            const from = currentPage * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            // Fetch posts, sort by likes array length (most liked first)
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false })
                .range(from, to);

            if (error) throw error;

            // Sort by number of likes descending
            const sorted = [...(data || [])].sort(
                (a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0)
            );

            if (data.length < PAGE_SIZE) setHasMore(false);
            setPosts((prev) => {
                const uniqueData = sorted.filter(
                    (newPost) => !prev.some((existingPost) => existingPost.id === newPost.id)
                );
                return [...prev, ...uniqueData];
            });
            setPage(currentPage + 1);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }

    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const { error } = await supabase
                .from("posts")
                .delete()
                .eq("id", postId);

            if (error) throw error;
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            alert("Error deleting post: " + err.message);
        }
    };

    useEffect(() => {
        getPosts(0);
    }, []);

    useEffect(() => {
        if (!isFetching || page === 0) {
            if (isFetching) setIsFetching(false);
            return;
        }
        getPosts(page);
        setIsFetching(false);
    }, [isFetching, page]);


    return (
        <PersistLogin>
            <section className={`min-h-screen w-full flex flex-col-reverse lg:flex-row lg:items-start`}>

                <BottomScrollListener onBottom={() => setIsFetching(true)}>
                    <Navbar />
                    <section className={`min-h-full w-full flex flex-col`}>

                        <div className={`w-full flex flex-col justify-center items-center pt-8`}>
                            <div className={`border-t-4 border-primary w-8`}></div>
                            <h3 className={`text-2xl text-white text-center`}>Popular</h3>
                        </div>

                        <div className={`lg:pb-12 p-12 flex flex-col gap-6 pb-24`}>
                            {posts.map((elem, index) => {
                                let date = getMonthAndDay(elem.created_at);
                                return (
                                    <div
                                        className={`${index === 0 ? "border-2 border-primary" : ""} ${index === 1 ? "border-2 border-lime-300" : ""
                                            } ${index === 2 ? "border-2 border-pink-300" : ""} ${index > 2 ? "border-2 border-gray-700" : ""
                                            } p-12`}
                                        key={elem.id}
                                    >
                                        <Feed
                                            key={elem.id}
                                            date_short={`${date[0]} ${date[1]}`}
                                            date_long={`${date[0]} ${date[1]} ${date[2]}`}
                                            post_url={`/posts/${elem.id}`}
                                            title={elem.title}
                                            username={elem.username}
                                            tags={elem.tags}
                                            content={elem.content}
                                            likes={elem.likes ?? []}
                                            isAuthor={session?.user?.id === elem.user_id}
                                            onDelete={() => handleDelete(elem.id)}
                                        />
                                    </div>
                                );
                            })}
                            {isLoading ? <Loading /> : ""}
                            {!hasMore && posts.length > 0 ? (
                                <div className={`flex justify-center items-center gap-2`}>
                                    <i className="material-symbols-rounded text-primary">Verified</i>
                                    <h2 className={`text-primary text-2xl text-center animate-pulse`}>
                                        You've seen em all
                                    </h2>
                                </div>
                            ) : ""}
                            <Branding />
                        </div>

                    </section>
                </BottomScrollListener>
            </section>
        </PersistLogin>
    );
};

export default Popular;
