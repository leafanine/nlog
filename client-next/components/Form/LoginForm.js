"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import "../../styles/LoginForm.css";
import Button from "../Button";
import Notification from "../Notification";
import supabase from "../../lib/supabase";

const LoginForm = () => {
    const { session } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Something went wrong");
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // If already logged in, redirect away
    useEffect(() => {
        if (session) router.replace("/");
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setErrorMsg(error.message);
                setIsError(true);
                return;
            }
            setEmail("");
            setPassword("");
            setIsSuccess(true);
            router.push("/");
        } catch (err) {
            setIsError(true);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSuccess(false);
            setIsError(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, [isSuccess, isError]);

    return (
        <div
            className={`flex lg:h-5/6 lg:w-4/5 md:w-full md:h-full gap-12 justify-center items-center pl-6 pr-6`}
        >
            {isSuccess ? (
                <Notification msg={`SUCCESS!\nWelcome user!`} color={`bg-primary`} />
            ) : isError ? (
                <Notification msg={`ERROR!\n${errorMsg}`} color={`bg-rose-600`} />
            ) : (
                ""
            )}
            <div
                className={`side_bg h-full lg:w-1/4 lg:flex justify-center items-center hidden border-t-2 border-b-2 border-primary shadow shadowMorbinTime`}
            >
                <span className={"span font-bold text-white text-5xl -rotate-90 select-none"}>
                    Login
                </span>
            </div>
            <div className={`flex flex-col gap-6 lg:w-1/2 md:w-3/4`}>
                <div className={`text-center lg:text-left`}>
                    <h1 className={`title text-5xl text-white font-bold`}>Welcome</h1>
                    <h2 className={`subtitle text-xl text-dark-gray`}>
                        Let's log you in quickly
                    </h2>
                </div>
                <form className={`flex flex-col gap-6`} onSubmit={handleSubmit}>
                    <input
                        className={`bg-dark-black text-white pt-5 pb-5 pl-12 pr-12 w-full border-1 border-primary`}
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ref={inputRef}
                        required
                    />
                    <input
                        className={`bg-dark-black text-white pt-5 pb-5 pl-12 pr-12 w-full border-1 border-primary`}
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className={`flex justify-between flex-col md:flex-row gap-4`}>
                        <Button text="Submit" />
                        <div>
                            <h2 className={`text-white`}>don't have an account?</h2>
                            <a href="/signup" className={`text-primary`}>sign up</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
