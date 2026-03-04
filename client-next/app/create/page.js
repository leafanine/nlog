"use client";

import CreatePost from "../../components/Form/CreatePost";
import RequireAuth from "../../components/RequireAuth";

const Create = () => {
    return (
        <RequireAuth>
            <section className={`flex h-screen w-screen justify-center items-center`}>
                <CreatePost />
            </section>
        </RequireAuth>
    );
};

export default Create;
