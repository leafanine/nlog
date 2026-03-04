"use client";

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Returns { session, loading }
// session.user.id          → user UUID
// session.user.email       → user email
// session.user.user_metadata.username → username set at sign-up
const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
