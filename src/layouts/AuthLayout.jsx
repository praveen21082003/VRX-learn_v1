import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useScrollIndicator from "@/hooks/useScrollIndicator";
import { useTheme } from "@/context/ThemeProvider";
import { Icon, InputWarnMessage } from "@/components/ui";
import clsx from "clsx";

import SignIn from "@/assets/images/SignIn.png";
import SignUp from "@/assets/images/SignUp.png";
import ResetPassword from "@/assets/images/ResetPassword.png";
import ForgotPassword from "@/assets/images/ForgotPassword.png";

function AuthLayout() {
    const scrollRef = useRef(null);
    const { darkMode, toggleTheme } = useTheme();
    const location = useLocation();
    useScrollIndicator(scrollRef);

    const verifyemail = location.pathname.includes('verify-email');
    const isSignup = location.pathname.includes('signup');

    const getImage = () => {
        if (location.pathname.includes("forgot-password")) {
            return ForgotPassword;
        }

        if (location.pathname.includes("login")) {
            return SignIn;
        }

        if (location.pathname.includes("signup")) {
            return SignUp;
        }

        return ResetPassword;
    };


    const getTitle = () => {
        if (location.pathname.includes("forgot-password"))
            return "Forgot Password?";
        if (location.pathname.includes("reset-password")) return "Reset Password?";
        if (location.pathname.includes("signup")) return "Sign Up";

        return "Welcome Back!";
    };

    return (
        <div className="flex min-h-screen w-full justify-center items-center text-main bg-[#FFFFFF] dark:bg-[#1e293bf8] px-4">
            <div className={clsx(
                "relative flex w-full max-w-4xl 2xl:max-w-5xl md:h-[32rem] 2xl:h-[36rem] overflow-hidden",
                !verifyemail && "rounded-xl bg-surface md:shadow-lg"
            )}>
                <div className={clsx(
                    "relative bg-brand overflow-hidden",
                    verifyemail ? "hidden" : "hidden md:block w-[55%]",
                )}>
                    <img
                        src={getImage()}
                        alt="Background Decor"
                        className="absolute top-35 left-[-11%] opacity-10 scale-110 pointer-events-none"
                    />
                    <img
                        src={getImage()}
                        alt="Login Illustration"
                        className="absolute bottom-0 top-50 2xl:top-70 right-0 object-contain z-10"
                    />
                </div>


                {/*------------ right panel --------------*/}
                <div
                    ref={scrollRef}
                    className={clsx(
                        "relative w-full flex flex-col items-center gap-2 py-4 px-8 overflow-y-auto custom-scroll",
                        verifyemail ? "md:w-full justify-center" : "md:w-[45%]",
                        isSignup ? "justify-start" : "justify-center",
                    )}
                >
                    {/* Theme Switcher - Fixed in the layout */}
                    {!verifyemail && (

                        <div className="sticky top-0 self-end z-10">
                            <button
                                onClick={toggleTheme}
                                className="relative flex items-center justify-between w-14 h-7 px-1.5 rounded-full bg-brand transition"
                            >
                                <Icon
                                    name="line-md:sunny-filled-loop-to-moon-filled-loop-transition"
                                    width="16"
                                    height="16"
                                    className="text-white"
                                />
                                <Icon
                                    name="line-md:moon-filled-alt-to-sunny-filled-loop-transition"
                                    width="16"
                                    height="16"
                                    className="text-white"
                                />
                                <div
                                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${darkMode ? "translate-x-0" : "translate-x-7"}`}
                                >
                                    <Icon
                                        name={
                                            !darkMode
                                                ? "line-md:moon-filled-alt-to-sunny-filled-loop-transition"
                                                : "line-md:sunny-filled-loop-to-moon-filled-loop-transition"
                                        }
                                        width="16"
                                        height="16"
                                        className="text-black"
                                    />
                                </div>
                            </button>
                        </div>
                    )}

                    {!verifyemail && (
                        <div className="flex flex-col items-center gap-1">
                            <img
                                src={`${darkMode ? "/logo-white.svg" : "/VRX-logo.svg"}`}
                                alt="VRX Logo"
                                className="h-14 w-14 object-contain"
                            />
                            <h1 className="text-h3 text-main">{getTitle()}</h1>
                        </div>
                    )}

                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;