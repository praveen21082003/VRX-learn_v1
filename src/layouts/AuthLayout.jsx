import React, { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useScrollIndicator from "@/hooks/useScrollIndicator";
import { useTheme } from "@/context/ThemeProvider";
import { Icon, InputWarnMessage } from '@/components/ui';
import clsx from 'clsx';

import LearningIllustration from '@/assets/images/Learning-Illustration.png'

function AuthLayout() {
    const scrollRef = useRef(null);
    const { darkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const verifyemail = location.pathname.includes('verify-email');

    const getTitle = () => {
        if (location.pathname.includes('forgot-password')) return "Forgot Password?";
        if (location.pathname.includes('reset-password')) return "Reset Password?";
        if (location.pathname.includes('sign-up')) return "Sign Up";

        return "Welcome Back!";
    };

    useScrollIndicator(scrollRef);

    return (
        <div className="flex min-h-screen w-full justify-center items-center text-main bg-background px-4">
            <div className="relative flex w-full max-w-5xl h-auto md:h-[40rem] rounded-xl overflow-hidden bg-surface md:shadow-lg">

                <div className={clsx("relative bg-brand overflow-hidden",
                    verifyemail
                        ? "hidden"
                        : "hidden md:block w-[55%]"
                )}>
                    <img
                        src={LearningIllustration}
                        alt="Background Decor"
                        className="absolute top-20 left-[-11%] opacity-10 scale-110 pointer-events-none"
                    />
                    <img
                        src={LearningIllustration}
                        alt="Login Illustration"
                        className="absolute bottom-1 right-6 object-contain z-10"
                    />
                </div>



                <div ref={scrollRef} className={clsx("relative w-full flex flex-col items-center justify-center gap-2 py-10 px-8 lg:overflow-y-auto custom-scroll",
                    verifyemail
                        ? "md:w-full"
                        : "md:w-[45%]"
                )}>

                    {/* Theme Switcher - Fixed in the layout */}
                    {!verifyemail &&
                        <>
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={toggleTheme}
                                    className="relative flex items-center justify-between w-14 h-7 px-1.5 rounded-full bg-brand transition"
                                >
                                    <Icon name="line-md:sunny-filled-loop-to-moon-filled-loop-transition" width="16" height="16" className="text-white" />
                                    <Icon name="line-md:moon-filled-alt-to-sunny-filled-loop-transition" width="16" height="16" className="text-white" />
                                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${darkMode ? "translate-x-0" : "translate-x-7"}`}>
                                        <Icon name={!darkMode ? "line-md:moon-filled-alt-to-sunny-filled-loop-transition" : "line-md:sunny-filled-loop-to-moon-filled-loop-transition"} width="16" height="16" className="text-black" />
                                    </div>
                                </button>
                            </div>


                            <div className="flex flex-col items-center gap-2 mt-10">
                                <img
                                    src={`${darkMode ? "/logo-white.svg" : "/VRX-logo.svg"}`}
                                    alt="VRX Logo"
                                    className="h-14 w-14 object-contain"
                                />
                                <h1 className="text-h3 text-main">{getTitle()}</h1>
                            </div>
                        </>

                    }
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;