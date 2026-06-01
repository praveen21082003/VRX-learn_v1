import { useCallback, useState } from "react";

import {
    forgotPassword,
    login,
    resetPassword,
    signup,
    verifyEmail,
} from "@/services/Authenticate.service";

import { extractErrorMessage } from "@/utils/errorUtils";

export const useAuthenticate = () => {

    const [loggingIn, setLoggingIn] = useState(false);

    const [sendingResetLink, setSendingResetLink] =
        useState(false);

    const [resettingPassword, setResettingPassword] =
        useState(false);

    const [signingUp, setSigningUp] = useState(false);

    const [verifying, setVerfiying] = useState(false);

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
            const errorType = err.response?.data?.type;

            let message = "Unable to login.";

            if (status === 401) {
                if (errorType === "EmailNotVerifiedError") {
                    message = "Please verify your email before logging in. Check your inbox for the verification link.";
                } else {
                    message = "Incorrect email or password.";
                }
            } else if (status === 422) {
                message = "Please enter a valid email and password.";
            } else if (status >= 500) {
                message = "Server error while logging in.";
            }

            return {
                success: false,
                data: null,
                message,
                status,
                errorType ,
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


    // =========================
    // SIGNUP
    // =========================

    const handleSignup = useCallback(async (payload) => {
        try {
            setSigningUp(true);

            const response = await signup(payload);

            return {
                success: true,
                data: response?.data || response,
                message:
                    response?.message ||
                    "sigup successfully.",
            };

        } catch (error) {
            console.log(error);
            const status = error.response?.status;

            const message = extractErrorMessage(error, {
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
            setSigningUp(false);
        }

    }, []);


    // =========================
    // verify email
    // =========================
    const handleVerifyEmail = useCallback(async ({ token }) => {
        try {
            setVerfiying(true);

            const response = await verifyEmail(token);

            return {
                success: true,
                data: response?.data || response,
                message:
                    response?.message ||
                    "sigup successfully.",
            };
        } catch (err) {
            console.log(err)
            const status = err.response?.status;

            const errorType =
                err.response?.data?.type;

            let message =
                "Unable to verify right now.";

            if (status === 400) {

                switch (errorType) {

                    case "InvalidPasswordResetTokenError":

                        message =
                            "We could not verify your email with this link. Please click the button below to request a new one.";

                        break;

                    case "EmailAlreadyVerifiedError":

                        message =
                            "Your email has already been verified.";

                        break;

                    default:

                        message =
                            err.response?.data?.message ||
                            "Unable to verify your email.";
                }
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
            setVerfiying(false);
        }
    }, []);


    return {

        // actions
        handleLogin,
        handleForgotPassword,
        handleResetPassword,
        handleSignup,
        handleVerifyEmail,

        // loading states
        loggingIn,
        signingUp,
        verifying,
        sendingResetLink,
        resettingPassword,
    };
};