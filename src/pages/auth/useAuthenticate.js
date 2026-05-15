import { useCallback, useState } from "react";

import {
    forgotPassword,
    login,
    resetPassword,
} from "@/services/Authenticate.service";

import { extractErrorMessage } from "@/utils/errorUtils";

export const useAuthenticate = () => {

    const [loggingIn, setLoggingIn] = useState(false);

    const [sendingResetLink, setSendingResetLink] =
        useState(false);

    const [resettingPassword, setResettingPassword] =
        useState(false);

    // =========================
    // LOGIN
    // =========================

    const handleLogin = useCallback(async (payload) => {

        try {

            setLoggingIn(true);

            const res = await login(payload);

            return {
                success: true,
                data: res?.data || res,
                message:
                    res?.message ||
                    "Logged in successfully.",
            };

        } catch (err) {

            const status = err.response?.status;
            console.log(err)
            console.log(status);

            const message =
                {
                    401: "Incorrect email or password.",
                    422: "Please enter a valid email and password.",
                    500: "Server error while logging in.",
                }[status]
                ||
                err.response?.data?.message
                ||
                "Unable to login.";

            return {
                success: false,
                data: null,
                message,
                status,
            };

        } finally {
            setLoggingIn(false);
        }

    }, []);

    // =========================
    // FORGOT PASSWORD
    // =========================

    const handleForgotPassword = useCallback(async (email) => {

        try {

            setSendingResetLink(true);

            const res = await forgotPassword(email);

            return {
                success: true,
                data: res?.data || res,
                message:
                    "Password reset link has been sent to your email address.",
            };

        } catch (err) {

            const status = err.response?.status;

            const message = extractErrorMessage(err, {
                404: "No account found with this email address.",
                422: "Please enter a valid email address.",
                500: "Unable to send reset link right now.",
            });

            return {
                success: false,
                data: null,
                message,
                status,
            };

        } finally {
            setSendingResetLink(false);
        }

    }, []);

    // =========================
    // RESET PASSWORD
    // =========================

    const handleResetPassword = useCallback(async ({
        token,
        password,
        confirmPassword,
    }) => {

        try {

            setResettingPassword(true);

            const res = await resetPassword({
                token,
                password,
                confirmPassword,
            });

            return {
                success: true,
                data: res?.data || res,
                message:
                    res?.message ||
                    "Password has been reset successfully.",
            };

        } catch (err) {

            const status = err.response?.status;

            const errorType =
                err.response?.data?.type;

            let message =
                "Unable to reset password right now.";

            if (status === 400) {

                switch (errorType) {

                    case "InvalidPasswordResetTokenError":

                        message =
                            "Reset link is invalid or expired.";

                        break;

                    default:

                        message =
                            err.response?.data?.message ||
                            "Invalid request.";
                }
            }

            else if (status === 422) {

                message =
                    "Please enter a valid password.";
            }

            else if (status >= 500) {

                message =
                    "Server error while resetting password.";
            }

            return {
                success: false,
                data: null,
                message,
                status,
            };

        } finally {
            setResettingPassword(false);
        }

    }, []);

    return {

        // actions
        handleLogin,
        handleForgotPassword,
        handleResetPassword,

        // loading states
        loggingIn,
        sendingResetLink,
        resettingPassword,
    };
};