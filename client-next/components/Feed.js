"use client";

import Tag from "./Tag";
import "../styles/Glitch.css";
import { useRouter } from "next/navigation";

const Feed = ({
    title,
    content,
    date_short,
    date_long,
    username,
    post_url,
    tags,
    likes,
    isAuthor,
    onDelete,
    image_url,
}) => {
    const router = useRouter();

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <article
            className={`w-full flex md:flex-row flex-col gap-4 lg:pb-12 pb-5 border-b-1 border-gray-700 relative group`}
        >
            <div
                className={`text-white md:flex-col md:flex hidden justify-center items-center gap-6 min-w-[100px]`}
            >
                <h2 className={`text-3xl font-bold text-center`}>{date_short}</h2>
                <div className={`flex gap-2`}>
                    <i className={`material-symbols-rounded text-primary`}>favorite</i>
                    <h2>{likes.length}</h2>
                </div>
            </div>

            <div className={`w-full flex flex-col gap-3`}>
                <div
                    className={`flex flex-col md:flex-row-reverse gap-6 cursor-pointer`}
                    onClick={() => router.push(post_url)}
                >
                    {image_url && (
                        <div className="w-full md:w-64 aspect-square overflow-hidden border-1 border-primary/30 group-hover:border-primary transition-all duration-300 bg-black/20 backdrop-blur-sm shrink-0">
                            <img
                                src={image_url}
                                alt={title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                            />
                        </div>
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <h1
                                data-text={title}
                                className={`text-primary md:text-4xl text-2xl font-bold hover:bg-primary active:bg-primary active:text-black hover:text-black pt-2 pb-2 glitch transition-all inline-block`}
                            >
                                {title}
                            </h1>
                            {isAuthor && (
                                <button
                                    onClick={handleDelete}
                                    className="text-rose-600 hover:text-white hover:bg-rose-600 p-2 rounded-full transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                                    title="Delete Post"
                                >
                                    <i className="material-symbols-rounded">delete</i>
                                </button>
                            )}
                        </div>
                        <h2 className={`text-white font-bold opacity-70`}>by @{username}</h2>
                        <p
                            className={`text-white md:text-xl text-base hover:opacity-80 active:opacity-80 transition-opacity break-words overflow-hidden line-clamp-3`}
                        >
                            {content.slice(0, 250)}
                            <span className={`text-primary font-bold ml-1`}>...read more</span>
                        </p>
                    </div>
                </div>
                <div className={`text-white flex md:hidden gap-6`}>
                    <h2 className={`font-bold`}>{date_long}</h2>
                    <div className={`flex gap-2`}>
                        <i className={`material-symbols-rounded`}>favorite</i>
                        <h2>{likes.length}</h2>
                    </div>
                </div>
                <div className={`gap-2 flex flex-wrap pt-2`}>
                    {tags?.map((elem, index) => {
                        return (
                            <Tag
                                key={index + Math.floor(Math.random() * 900) + 1}
                                title={elem}
                            />
                        );
                    })}
                </div>
            </div>
        </article>
    );
};

export default Feed;
