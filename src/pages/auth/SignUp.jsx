import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useAuthenticate } from "./useAuthenticate";

import { Icon, Input, Button, StatusBanner } from "@/components/ui";

function SignUp() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const { handleSignup, signingUp } = useAuthenticate();

    const [warning, setWarning] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [bannerMsg, setBannerMsg] = useState(""); // for StatusBanner (non-field errors)
    const [bannerType, setBannerType] = useState("error");

    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (warning[name]) setWarning((prev) => ({ ...prev, [name]: "" }));
        if (bannerMsg) setBannerMsg("");
    };

    const icons = [
        { key: "web", name: "mdi:web", navlink: "https://vrnexgen1.com/", hover: "hover:text-blue-500" },
        { key: "linkedin", name: "mdi:linkedin", navlink: "#", hover: "hover:text-blue-600" },
        { key: "youtube", name: "mdi:youtube", navlink: "#", hover: "hover:text-red-500" },
        { key: "github", name: "mdi:github", navlink: "#", hover: "hover:text-black" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBannerMsg("");

        // frontend validation
        const newWarnings = {};
        if (!credentials.username) newWarnings.username = "Please provide username";
        if (!credentials.email) newWarnings.email = "Please provide email";
        if (!credentials.password) newWarnings.password = "Password can't be empty";
        if (!credentials.confirmPassword) newWarnings.confirmPassword = "Please confirm your password";
        if (credentials.password && credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
            newWarnings.confirmPassword = "Passwords do not match";
        }

        if (Object.values(newWarnings).some(Boolean)) {
            setWarning(newWarnings);
            return;
        }

        const response = await handleSignup(credentials);

        if (!response.success) {
            if (response.status === 409) {
                // email already exists — set as field warning
                setWarning(prev => ({ ...prev, email: "An account with this email already exists." }));
            } else {
                // all other errors — show in banner
                setBannerMsg(response.message);
                setBannerType("error");
            }
            return;
        }

        // success
        setBannerMsg("Please check your email for the verification link to complete registration.");
        setBannerType("success");
        setCredentials({ username: "", email: "", password: "", confirmPassword: "" });
    };

    return (
        <>
            {bannerMsg && (
                <StatusBanner type={bannerType} message={bannerMsg} />
            )}

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
                <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Enter your password again"
                    paddingClass="p-2"
                    icon="material-symbols:lock"
                    bgClass="bg-surface"
                    inputWarning={warning.confirmPassword}
                    onChange={handleChange}
                    value={credentials.confirmPassword}
                    autoComplete="new-password"
                />

                <Button
                    type="submit"
                    bgClass="bg-primary"
                    className="p-2 mt-3 rounded-lg"
                    buttonName={signingUp ? "Signing up..." : "Sign Up"}
                    disabled={signingUp}
                />

                <p className="text-caption text-muted mt-1.5 hover:text-brand transition-colors">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} className="text-[#0088ff] font-bold cursor-pointer">
                        Login
                    </span>
                </p>
            </form>

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