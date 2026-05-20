import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useAuthenticate } from "./useAuthenticate";

import { Icon, Input, Button, InputWarnMessage } from "@/components/ui";
import { authMe } from "@/services/Authenticate.service";


function VerifyEmail() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const {
        handleLogin,
        loggingIn,
    } = useAuthenticate();

    const [warning, setWarning] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    // Handle input changes and clear local validation errors
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (warning[name]) setWarning((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.email || !credentials.password || !credentials.username) {
            setWarning({
                email: !credentials.email ? "Please provide email" : "",
                password: !credentials.password ? "Password can't be empty" : "",
                username: !credentials.username ? "Please provide username" : "",
            });
            return;
        }

        const response = await handleLogin({
            email: credentials.email,
            password: credentials.password,
        });

        console.log(response);

        if (!response.success) {
            setMessage(response.message);
            return;
        }

        if (response.success) {
            await refreshUser();
            navigate("/dashboard", { replace: true });
        }

    };

    return (
        <div className="flex flex-col items-center gap-4 w-1/2">
                 <p
                        className="text-h45 text-center text-muted mt-1.5 hover:text-brand transition-colors"
                    >
            We are almost finished setting up your account. Please do not close or refresh this window.                    </p>
          

                {/* <Button
                    type="submit"
                    bgClass="bg-primary"
                    className="p-2 mt-3 w-full rounded-lg"
                    buttonName={loggingIn ? "Verifying..." : "Verify Email"}
                    disabled={loggingIn}
                /> */}

            

            {/* Social Links Section */}
           
        </div>
    );
}

export default VerifyEmail;