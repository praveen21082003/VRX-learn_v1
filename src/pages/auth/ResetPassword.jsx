import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';

import { useAuthenticate } from "./useAuthenticate";

import { Icon, Input, Button, InputWarnMessage } from "@/components/ui";


function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");
    console.log(token);

    const { handleResetPassword, resettingPassword } = useAuthenticate();

    const [payload, setPayload] = useState({
        token: token,
        password: "",
        confirmPassword: "",
    });

    const [warning, setWarning] = useState({
        password: "",
        confirmPassword: "",
        token: "",
    });

    const [warnMsg, setWarnMsg] = useState("");

    const validateForm = () => {
        const newWarning = { password: "", confirmPassword: "", token: "" };
        let isValid = true;

        if (!payload.password.trim()) {
            newWarning.password = "Please enter your new password.";
            isValid = false;
        }

        if (!payload.confirmPassword.trim()) {
            newWarning.confirmPassword = "Please confirm your password.";
            isValid = false;
        }

        if (payload.password && payload.confirmPassword && payload.password !== payload.confirmPassword) {
            newWarning.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        if (!payload.token) {
            newWarning.token = "Reset link is invalid or expired.";
            isValid = false;
        }

        setWarning(newWarning);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prev) => ({ ...prev, [name]: value }));
        // clear field warning on type
        setWarning((prev) => ({ ...prev, [name]: "" }));
        setWarnMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const response = await handleResetPassword(payload);

        if (!response.success) {
            setWarnMsg(response.message);
            return;
        }

        navigate("/login");
    };

    return (
        <>
            <div className="min-h-4">
                {warning.token && (
                    <InputWarnMessage message={warning.token} />
                )}
                {warnMsg && (
                    <InputWarnMessage message={warnMsg} />
                )}
            </div>

            <form onSubmit={handleSubmit} className='space-y-3 w-full'>

                {/* general API error */}


                <Input
                    name="password"
                    type="password"
                    label="New Password"
                    placeholder="Enter your new password"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    inputWarning={warning.password}
                    onChange={handleChange}
                    value={payload.password}
                    autoComplete="new-password"
                />

                <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    inputWarning={warning.confirmPassword}
                    onChange={handleChange}
                    value={payload.confirmPassword}
                    autoComplete="new-password"
                />

                <div className='space-y-4 flex flex-col'>
                    <Button
                        type="submit"
                        className="p-2 rounded-lg font-semibold mt-4 cursor-pointer"
                        buttonName={resettingPassword ? "Resetting..." : "Reset Password"}
                        disabled={resettingPassword}
                    />
                    <Button
                        onClick={() => navigate("/login")}
                        bgClass=""
                        textClass=""
                        className="rounded-lg p-2 font-semibold"
                        buttonName="Back To Login"
                        frontIconName="eva:arrow-back-fill"
                    />
                </div>

            </form>
        </>
    );
}

export default ResetPassword;