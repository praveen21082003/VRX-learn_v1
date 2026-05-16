import React, { useState } from 'react'

import { useAuthenticate } from "./useAuthenticate";
import { useToast } from '@/context/ToastProvider';

import { Icon, Input, Button, InputWarnMessage } from "@/components/ui";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

    const navigate = useNavigate();
    const { addToast } = useToast();

    const {
        handleForgotPassword,
        sendingResetLink,
    } = useAuthenticate();


    // states
    const [email, setEmail] = useState(null);
    const [warning, setWarning] = useState("");
    const [successMsg, setSuccessMsg] = useState("");


    // validation function
    const validateEmail = () => {

        // empty
        if (!email?.trim()) {

            setWarning("Please enter your email address.");

            return false;
        }

        // email regex
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            setWarning(
                "Please enter a valid email address."
            );

            return false;
        }

        // clear old message
        setWarning("");

        return true;
    };


    // handle function
    const handleChange = async (e) => {
        setEmail(e.target.value);
        setWarning("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail()) return;

        const response = await handleForgotPassword(email);

        if (response.success) {
            setSuccessMsg(response.message);
            setEmail("");
            addToast(
                "Reset link sent! Please check your inbox.",
                "success"
            );
        }
        if (!response.success) {
            setWarning(response.message);
        }

    }



    return (
        <div>

            {successMsg ? (
                <div className="flex flex-col items-center gap-2 text-center bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 mt-2">
                    <Icon name="mdi:checkbox-marked-circle" height="28" width="28" className="text-green-600 dark:text-green-400" />
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium leading-5 max-w-xs">
                        Password reset link sent successfully.
                        Please check your inbox.
                    </p>
                </div>
            ) : (
                <p className="text-sm  text-center mb-4 mt-2 ">
                    No Worries , Enter your Email Address and we'll send you a link to reset
                    your password.
                </p>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
                <Input
                    name="email"
                    label="Email"
                    placeholder="Enter your email id"
                    paddingClass="p-2"
                    icon="ic:outline-email"
                    inputWarning={warning}
                    onChange={handleChange}
                    bgClass="bg-surface"
                    value={email}
                    autoComplete="email"
                />

                <div className='space-y-4 flex flex-col'>
                    <Button
                        type="submit"
                        className="p-2 rounded-lg font-semibold  mt-4 cursor-pointer"
                        buttonName={sendingResetLink ? "Sending Reset Link..." : "Send Reset Link"}
                        disabled={sendingResetLink}
                    />
                    <Button
                        onClick={() => navigate('/login')}
                        bgClass=""
                        textClass=""
                        className="rounded-lg p-2 font-semibold "
                        buttonName="Back To Login"
                        frontIconName="eva:arrow-back-fill"
                    />
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword
