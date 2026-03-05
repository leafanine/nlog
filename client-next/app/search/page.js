"use client";

import { useEffect, useState, useCallback } from "react";
import supabase from "../../lib/supabase";
import _ from "lodash";
import Feed from "../../components/Feed";
import getMonthAndDay from "../../utils/getMonthAndDay";
import Loading from "../../components/Loading";
import Branding from "../../components/Branding";


import useAuth from "../../hooks/useAuth";

const Search = () => {
    const [searchText, setSearchText] = useState("");
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { session } = useAuth();

    const searchPost = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setPosts([]);
            return;
        }
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .ilike("title", `%${searchTerm}%`)
                .order("created_at", { ascending: false });

            if (!error) setPosts(data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
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

    const handlePostSearch = useCallback(_.debounce(searchPost, 1000), []);

    useEffect(() => {
        handlePostSearch(searchText);
    }, [searchText]);

    return (
        <section className={`flex flex-col min-h-screen w-full p-10 gap-2`}>
            <div className={`flex flex-col gap-4 w-full`}>
                <h1 className={`text-white lg:text-6xl md:text-4xl text-2xl font-bold text-center`}>
                    Search
                </h1>
                <input
                    type="search"
                    value={searchText}
                    placeholder={"Enter keywords to search"}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={`bg-dark-black text-white pt-2 pb-2 pl-12 pr-12 w-full border-1 border-primary text-2xl`}
                />
            </div>
            {!isLoading && posts.length === 0 && searchText.trim() ? (
                <h2 className={`text-gray-500 text-2xl`}>No Result Found</h2>
            ) : ""}
            {isLoading ? (
                <Loading />
            ) : (
                <div className={`lg:pb-12 flex flex-col gap-6 lg:pt-12 pt-5`}>
                    {posts.map((elem) => {
                        let date = getMonthAndDay(elem.created_at);
                        return (
                            <Feed
                                key={elem.id}
                                date_short={`${date[0]} ${date[1]}`}
                                date_long={date}
                                post_url={`/posts/${elem.id}`}
                                title={elem.title}
                                username={elem.username}
                                tags={elem.tags}
                                content={elem.content}
                                likes={elem.likes ?? []}
                                isAuthor={session?.user?.id === elem.user_id}
                                onDelete={() => handleDelete(elem.id)}
                            />
                        );
                    })}
                    <Branding />
                </div>

            )}
        </section>
    );
};

export default Search;
