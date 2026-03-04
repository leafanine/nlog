"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import _ from "lodash";
import supabase from "../../lib/supabase";
import ReqLabel from "../ReqLabel";

const USERNAME_REGEX =
    /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

const UsernameInput = ({ username, setUsername }) => {
    const [usernameFound, setUsernameFound] = useState(-1); // -1=unknown, 0=available, 1=taken
    const [isLoading, setIsLoading] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [verifyUname, setVerifyUname] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const usernameSearch = async (input) => {
        if (!input || input.length < 3) {
            setUsernameFound(-1);
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await supabase
                .from("profiles")
                .select("id")
                .eq("username", input)
                .maybeSingle();

            // data === null means no row found → username is available
            setUsernameFound(data ? 1 : 0);
        } catch {
            setUsernameFound(-1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameSearch = useCallback(_.debounce(usernameSearch, 1000), []);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    useEffect(() => {
        handleUsernameSearch(username);
        setVerifyUname(USERNAME_REGEX.test(username));
    }, [username]);

    return (
        <div className={`flex flex-col gap-2 w-full`}>
            <div className={`w-full flex gap-2 items-center`}>
                <input
                    className={`bg-dark-black text-white pt-5 pb-5 pl-12 pr-12 w-full border-1 border-primary`}
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                    autoComplete="off"
                    ref={inputRef}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                />
                <div>
                    {isLoading ? (
                        <i className={`material-symbols-rounded text-primary`}>Replay_Circle_Filled</i>
                    ) : usernameFound === 1 || !verifyUname ? (
                        <i className={`material-symbols-rounded text-rose-600`}>Error</i>
                    ) : usernameFound === 0 && verifyUname ? (
                        <i className={`material-symbols-rounded text-primary`}>Check_Circle</i>
                    ) : (
                        <i className={`material-symbols-rounded text-primary`}>Circle</i>
                    )}
                </div>
            </div>
            <div className={`flex-col gap-1 pt-2 pb-2 ${isInputFocused ? "flex" : "hidden"}`}>
                <ReqLabel
                    iconName={`${usernameFound === 0 ? "Check_Circle" : usernameFound === 1 ? "Error" : "Circle"}`}
                    req={`${usernameFound === 1 ? "Username Not Available" : usernameFound === 0 ? "Username available" : "Checking..."}`}
                    color={`${usernameFound === 1 ? "text-rose-600" : usernameFound === 0 ? "text-primary" : "text-dark-gray"}`}
                />
                <ReqLabel
                    iconName={`${verifyUname ? "Check_Circle" : "Error"}`}
                    req="No space and starting or trailing underscores"
                    color={`${verifyUname ? "text-primary" : "text-rose-600"}`}
                />
            </div>
        </div>
    );
};

export default UsernameInput;
