"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ children }) => {
    const { session, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !session) {
            router.replace("/login");
        }
    }, [session, loading]);

    if (loading || !session) return null;

    return children;
};

export default RequireAuth;
