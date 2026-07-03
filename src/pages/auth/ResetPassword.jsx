import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { useAuthenticate } from "./useAuthenticate";

import { Icon, Input, Button, InputWarnMessage, StatusBanner } from "@/components/ui";


function ResetPassword() {

     useDocumentTitle("Reset Password");

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const { handleResetPassword, resettingPassword } = useAuthenticate();

    // states
    const [payload, setPayload] = useState({
        token: token,
        newPassword: "",
        newConfirmPassword: "",
    });
    const [warning, setWarning] = useState({
        newPassword: "",
        newConfirmPassword: "",
        token: "",
    });
    const [warnMsg, setWarnMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");


    // functions 
    const validateForm = () => {
        const newWarning = { newPassword: "", newConfirmPassword: "", token: "" };
        let isValid = true;

        if (!payload.newPassword.trim()) {
            newWarning.newPassword = "Please enter your new password.";
            isValid = false;
        }

        if (!payload.newConfirmPassword.trim()) {
            newWarning.newConfirmPassword = "Please confirm your password.";
            isValid = false;
        }

        if (payload.newPassword && payload.newConfirmPassword && payload.newPassword !== payload.newConfirmPassword) {
            newWarning.newConfirmPassword = "Passwords do not match.";
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
        console.log(payload);
        console.log(response);

        if (!response.success) {
            setWarnMsg(response.message);
            return;
        }

        // success — show message then navigate
        setSuccessMsg("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);

    };

    return (
        <div className='h-full w-full flex flex-col justify-center items-center'>
            
            {successMsg && <StatusBanner type="success" message={successMsg} />}
            {warning.token && <InputWarnMessage message={warning.token} />}
            {warnMsg && <StatusBanner type="error" message={warnMsg} />}

            <form onSubmit={handleSubmit} className='space-y-2 w-full'>
                {/* general API error */}
                <Input
                    name="newPassword"
                    type="password"
                    label="New Password"
                    placeholder="Enter your new password"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    inputWarning={warning.newPassword}
                    onChange={handleChange}
                    value={payload.newPassword}
                    autoComplete="new-password"
                />

                <Input
                    name="newConfirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    inputWarning={warning.newConfirmPassword}
                    onChange={handleChange}
                    value={payload.newConfirmPassword}
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
        </div>
    );
}

export default ResetPassword;