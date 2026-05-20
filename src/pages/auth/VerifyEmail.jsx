import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "@/context/ThemeProvider";
import { useAuthenticate } from "./useAuthenticate";
import { Icon, Button } from "@/components/ui";

function VerifyEmail() {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [searchParams] = useSearchParams();
    const { handleVerifyEmail, verifying } = useAuthenticate();

    const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        console.log(token)

        const verify = async () => {
            const response = await handleVerifyEmail({ token });

            if (response.success) {
                setStatus("success");
            } else {
                setStatus("failed");
                setMessage(response.message);
            }
        };

        if (token) {
            verify();
        } else {
            setStatus("failed");
            setMessage("Verification link is invalid or expired.");
        }
    }, []);


    // ── Verifying ────────────────────────────────────────
    if (status === "verifying") {
        return (
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative flex items-center justify-center">
                    <img
                        src={darkMode ? "/logo-white.svg" : "/VRX-logo.svg"}
                        alt="VRX Logo"
                        className="h-9 absolute z-10"
                    />
                    <div className="w-20 h-20 rounded-full border-8 border-gray-200 border-t-primary animate-spin" />
                </div>
                <h1 className="text-h3 font-semibold text-main">Verifying your email....</h1>
                <p className="text-h45 text-center text-muted max-w-xl">
                    We are almost finished setting up your account. Please do not close or refresh this window.
                </p>
            </div>
        );
    }

    // ── Success ──────────────────────────────────────────
    if (status === "success") {
        return (
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon name="mdi:checkbox-marked-circle" height="48" width="48" className="text-green-600" />
                </div>
                <h1 className="text-h3 font-semibold text-main">Verification Successful</h1>
                <p className="text-h45 text-center text-muted max-w-xs">
                    You are all clear and ready to go! Your access is granted. Click the button below to log in.
                </p>
                <Button
                    buttonName="Back to Login"
                    className="px-6 py-2 rounded-lg w-full max-w-xl"
                    onClick={() => navigate("/login")}
                />
            </div>
        );
    }

    // ── Failed ───────────────────────────────────────────
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <Icon name="mdi:close-circle" height="48" width="48" className="text-red-600" />

            <h1 className="text-h3 font-semibold text-main">Verification Failed</h1>
            <p className="text-h45 text-center text-muted max-w-xl">
                {message || "We could not verify your email with this link. Please click the button below to request a new one."}
            </p>
            <Button
                buttonName="Contact Us"
                className="px-6 py-2 rounded-lg w-full max-w-xs"
                onClick={() => window.location.href = "mailto:sales@vrnexgen1.com"}
            />
        </div>
    );
}

export default VerifyEmail;