import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useAuthenticate } from "./useAuthenticate";

import { Icon, Input, Button, InputWarnMessage } from "@/components/ui";
import { authMe } from "@/services/Authenticate.service";
import SignUp from "./SignUp";


function Login() {
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

    const icons = [
        { key: "web", name: "mdi:web", navlink: "https://vrnexgen1.com/", hover: "hover:text-blue-500" },
        { key: "linkedin", name: "mdi:linkedin", navlink: "https://www.linkedin.com/company/vrnexgen/", hover: "hover:text-blue-600" },
        { key: "youtube", name: "mdi:youtube", navlink: "https://www.youtube.com/@VRNeXGen1/", hover: "hover:text-red-500" },
        { key: "github", name: "mdi:github", navlink: "#", hover: "hover:text-black" },
    ];



    const validateForm = () => {
        const errors = {};

        // Email validation
        if (!credentials.email.trim()) {
            errors.email = "Please provide email";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)
        ) {
            errors.email = "Please enter a valid email";
        }

        // Password validation
        if (!credentials.password.trim()) {
            errors.password = "Password can't be empty";
        } 
        // else if (credentials.password.length < 6) {
        //     errors.password = "Password must be at least 6 characters";
        // }

        setWarning(errors);

        // return true if no errors
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!validateForm()) return;


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
        <div className="flex flex-col justify-center items-center w-full">
            <div className="min-h-2">
                {message && (
                    <InputWarnMessage message={message} />
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
                <Input
                    name="email"
                    label="Email"
                    placeholder="Enter your email id"
                    paddingClass="p-2"
                    icon="ic:baseline-email"
                    inputWarning={warning.email}
                    onChange={handleChange}
                    bgClass="bg-surface"
                    value={credentials.email}
                    autoComplete="email"
                />


                <Input
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    bgClass="bg-surface"
                    inputWarning={warning.password}
                    onChange={handleChange}
                    value={credentials.password}
                    autoComplete="new-password"
                />

                <p onClick={() => navigate("/forgot-password")}
                    className="text-caption text-muted mt-2 cursor-pointer hover:text-[#0088ff] hover:font-semibold transition-colors"
                >
                    Forgot Password?
                </p>

                <Button
                    type="submit"
                    bgClass="bg-primary"
                    className="p-2 rounded-lg"
                    buttonName={loggingIn ? "Logging in..." : "Login"}
                    disabled={loggingIn}
                />

                <p className="text-caption text-muted  hover:text-brand transition-colors">
                    Don't have an account? <span onClick={() => navigate("/signup")} className="text-[#0088ff] font-bold  cursor-pointer">Sign up</span>
                </p>
            </form>

            {/* Social Links Section */}
            <div className="flex gap-3 py-4">
                {icons.map((i) => (
                    <a key={i.key} href={i.navlink} target="_blank" rel="noopener noreferrer">
                        <Icon
                            name={i.name}
                            height="28"
                            width="28"
                            className={`text-muted ${i.hover} transition-colors duration-200`}
                        />
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Login;