"use client";

import DetailedFeed from "../../../components/DetailedFeed";
import Navbar from "../../../components/Navbar";
import PersistLogin from "../../../components/PersistLogin";

const PostDetail = () => {
    return (
        <PersistLogin>
            <section className={`flex flex-col-reverse lg:flex-row lg:items-start h-screen`}>
                <Navbar />
                <div className={`lg:pl-24 w-full`}>
                    <DetailedFeed />
                </div>
            </section>
        </PersistLogin>
    );
};

export default PostDetail;
