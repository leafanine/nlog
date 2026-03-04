"use client";

import supabase from "../lib/supabase";

const useLogout = () => {
    const logout = async () => {
        await supabase.auth.signOut();
    };
    return logout;
};

export default useLogout;
