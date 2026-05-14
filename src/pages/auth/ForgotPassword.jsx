import React, { useState } from 'react'

import { useAuthenticate } from "./useAuthenticate";

import { Icon, Input, Button, InputWarnMessage } from "@/components/ui";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

    const navigate = useNavigate();

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
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail()) return;

        const response = await handleForgotPassword(email);

        if (response.success) {
            setSuccessMsg(response.message);
        }
        if (!response.success) {
            setWarning(response.message);
        }

    }



    return (
        <div>

            {successMsg ? (
                <p className="text-sm text-center text-[#0F5132] font-medium mb-4 mt-2">
                    We've sent a password reset link to your email address.
                    Please check your inbox and follow the instructions to reset your password.
                </p>
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
