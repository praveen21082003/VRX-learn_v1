import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from "@/context/ThemeProvider";
import { Icon, InputWarnMessage } from '@/components/ui';

function AuthLayout() {
    const { darkMode, toggleTheme } = useTheme();
    const [warnMsg, setWarnMsg] = useState("");
    const location = useLocation();

    const getTitle = () => {
        if (location.pathname.includes('forgot-password')) return "Forgot Password?";
        if (location.pathname.includes('reset-password')) return "Reset Password?";
        return "Welcome Back!";
    };

    return (
        <div className="flex min-h-screen w-full justify-center items-center text-main bg-background px-4">
            <div className="relative flex w-full max-w-4xl h-auto md:h-[33rem] rounded-xl overflow-hidden bg-surface md:shadow-lg">


                <div className="hidden md:block relative w-lg bg-brand overflow-hidden">
                    <img
                        src="/src/assets/images/Learning-Illustration.png"
                        alt="Background Decor"
                        className="absolute top-20 left-[-11%] opacity-10 scale-110 pointer-events-none"
                    />
                    <img
                        src="/src/assets/images/Learning-Illustration.png"
                        alt="Login Illustration"
                        className="absolute bottom-1 right-6 object-contain z-10"
                    />
                </div>


                <div className="relative w-full md:w-[400px] flex flex-col items-center justify-center py-8 px-8">

                    {/* Theme Switcher - Fixed in the layout */}
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


                    <div className="flex flex-col items-center gap-2 mb-6">
                        <img
                            src={`${darkMode ? "/logo-white.svg" : "/VRX-logo.svg"}`}
                            alt="VRX Logo"
                            className="h-14 w-14 object-contain"
                        />
                        <h1 className="text-h4 text-main">{getTitle()}</h1>
                        {warnMsg && <InputWarnMessage message={warnMsg} />}
                    </div>
                    <Outlet context={{ setWarnMsg }} />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;