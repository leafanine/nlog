"use client";

import Loading from "./Loading";
import useAuth from "../hooks/useAuth";

// Supabase automatically restores the session from localStorage.
// We just show a spinner while that initial check completes.
const PersistLogin = ({ children }) => {
    const { loading } = useAuth();

    return (
        <>
            {loading ? (
                <div className={`flex justify-center items-center h-screen`}>
                    <Loading />
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default PersistLogin;
