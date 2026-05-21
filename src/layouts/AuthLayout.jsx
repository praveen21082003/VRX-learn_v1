import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeProvider";
import { Icon, InputWarnMessage } from "@/components/ui";
import clsx from "clsx";

import Sign_in from "@/assets/images/Sign_in.png";
import Sign_Up from "@/assets/images/Sign_Up.png";
import Reset_Password from "@/assets/images/Reset_Password.png";
import Forgot_Password from "@/assets/images/Forgot_Password.png";

function AuthLayout() {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const verifyemail = location.pathname.includes("verify-email");

  const getImage = () => {
    if (location.pathname.includes("forgot-password")) {
      return Forgot_Password;
    }

    if (location.pathname.includes("login")) {
      return Sign_in;
    }

    if (location.pathname.includes("signup")) {
      return Sign_Up;
    }

    return Reset_Password;
  };

  const getTitle = () => {
    if (location.pathname.includes("forgot-password"))
      return "Forgot Password?";
    if (location.pathname.includes("reset-password")) return "Reset Password?";
    if (location.pathname.includes("sign-up")) return "Sign Up";

    return "Welcome Back!";
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-center text-main bg-background px-4">
      {/* <div className="relative flex w-full max-w-5xl h-auto md:h-[40rem] rounded-xl overflow-hidden bg-surface md:shadow-lg"> */}
            <div className={clsx("relative flex w-full max-w-5xl h-auto md:h-[40rem] overflow-hidden",
                !verifyemail && "rounded-xl bg-surface md:shadow-lg"
            )}>

        <div
          className={clsx(
            "relative bg-brand overflow-hidden ",
            verifyemail ? "hidden" : "hidden md:block w-[55%]",
          )}
        >
          <img
            src={getImage()}
            alt="Background Decor"
            className="absolute top-40 left-[-11%] opacity-10 scale-110 pointer-events-none"
          />
          <img
            src={getImage()}
            alt="Login Illustration"
            className="absolute bottom-0 top-70 right-0 object-contain z-10"
          />
        </div>

        <div
          className={clsx(
            "relative w-full flex flex-col items-center justify-center gap-2 py-8 px-8 ",
            verifyemail ? "md:w-full" : "md:w-[45%]",
          )}
        >
          {/* Theme Switcher - Fixed in the layout */}
          {!verifyemail && (
            <>
              <div className="absolute top-4 right-4">
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

              <div className="flex flex-col items-center gap-2">
                <img
                  src={`${darkMode ? "/logo-white.svg" : "/VRX-logo.svg"}`}
                  alt="VRX Logo"
                  className="h-14 w-14 object-contain"
                />
                <h1 className="text-h3 text-main">{getTitle()}</h1>
              </div>
            </>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;