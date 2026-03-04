"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import "../../styles/SignUpForm.css";

import UsernameInput from "../FormComponents/UsernameInput";
import PasswordInput from "../FormComponents/PasswordInput";
import ConfirmPasswordInput from "../FormComponents/ConfirmPasswordInput";
import Button from "../Button";
import Notification from "../Notification";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const USERNAME_REGEX = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Something went wrong");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (
            !EMAIL_REGEX.test(email) ||
            !PASSWORD_REGEX.test(password) ||
            !USERNAME_REGEX.test(username) ||
            password !== confirmPass
        ) {
            setErrorMsg("Please check all fields and try again");
            setIsError(true);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }, // stored in user_metadata; trigger auto-inserts into profiles
                },
            });

            if (error) {
                setErrorMsg(error.message);
                setIsError(true);
                return;
            }

            setIsSuccess(true);
            setEmail("");
            setUsername("");
            setPassword("");
            setConfirmPass("");
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
                <Notification msg={`SUCCESS!\nCheck your email to confirm, then log in`} color={`bg-primary`} />
            ) : isError ? (
                <Notification msg={`ERROR!\n${errorMsg}`} color={`bg-rose-600`} />
            ) : (
                ""
            )}
            <div
                className={`side_bg h-full lg:w-1/4 lg:flex justify-center items-center hidden border-t-2 border-b-2 border-primary shadow shadowMorbinTime`}
            >
                <span className={"span font-bold text-white text-5xl -rotate-90 select-none"}>
                    Sign Up
                </span>
            </div>
            <div className={`flex flex-col gap-6 lg:w-1/2 md:w-3/4`}>
                <div className={`text-center lg:text-left`}>
                    <h1 className={`title text-5xl text-white font-bold`}>Welcome</h1>
                    <h2 className={`subtitle text-xl text-dark-gray`}>
                        Let's sign you up quickly
                    </h2>
                </div>
                <form className={`flex flex-col gap-6`} onSubmit={handleSubmit}>
                    <UsernameInput username={username} setUsername={(v) => setUsername(v)} />
                    <input
                        className={`bg-dark-black text-white pt-5 pb-5 pl-12 pr-12 w-full border-1 border-primary`}
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <PasswordInput password={password} setPassword={(v) => setPassword(v)} />
                    <ConfirmPasswordInput
                        password={password}
                        confirmPass={confirmPass}
                        setConfirmPass={(v) => setConfirmPass(v)}
                    />
                    <div className={`flex justify-between flex-col md:flex-row gap-4`}>
                        <Button text="Submit" />
                        <div>
                            <h2 className={`text-white`}>already have an account?</h2>
                            <a href="/login" className={`text-primary`}>log in</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
