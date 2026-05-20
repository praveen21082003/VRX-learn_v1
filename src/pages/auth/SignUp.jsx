import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useAuthenticate } from "./useAuthenticate";

import { Icon, Input, Button, InputWarnMessage } from "@/components/ui";
import { authMe } from "@/services/Authenticate.service";


function SignUp() {
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
        { key: "linkedin", name: "mdi:linkedin", navlink: "#", hover: "hover:text-blue-600" },
        { key: "youtube", name: "mdi:youtube", navlink: "#", hover: "hover:text-red-500" },
        { key: "github", name: "mdi:github", navlink: "#", hover: "hover:text-black" },
    ];

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
        <>
            <div className="min-h-2">
                {message && (
                    <InputWarnMessage message={message} />
                )}
            </div>
                
            <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 w-full">
                <Input
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
                    paddingClass="p-2"
                    icon="mdi:user"
                    inputWarning={warning.username}
                    onChange={handleChange}
                    bgClass="bg-surface"
                    value={credentials.username}
                />
                
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
                    inputWarning={warning.password}
                    onChange={handleChange}
                    bgClass="bg-surface"
                    value={credentials.password}
                    autoComplete="new-password"
                />

                <div className="flex flex-col gap-1">
                    <Input
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Enter your password again"
                        paddingClass="p-2"
                        icon="material-symbols:lock"
                        bgClass="bg-surface"
                        inputWarning={warning.password}
                        onChange={handleChange}
                        value={credentials.password}
                        autoComplete="new-password"
                    />
                    
                </div>

                <Button
                    type="submit"
                    bgClass="bg-primary"
                    className="p-2 mt-3 rounded-lg"
                    buttonName={loggingIn ? "Signing up..." : "Sign Up"}
                    disabled={loggingIn}
                />

                 <p
                        className="text-caption text-muted mt-1.5 hover:text-brand transition-colors"
                    >
                        Already have an account? <span onClick={() => navigate("/login")} className="text-[#0088ff] font-bold  cursor-pointer">Login</span>
                    </p>
            </form>

            {/* Social Links Section */}
            <div className="flex gap-3 py-2">
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
        </>
    );
}

export default SignUp;