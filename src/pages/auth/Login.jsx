import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; 
import { Icon, Input, Button } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { login, getMe } from "@/services/User.service"; 

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth(); 
    const { setWarnMsg } = useOutletContext();

    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState({ email: "", password: "" });
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
        setWarnMsg("");

      
        if (!credentials.email || !credentials.password) {
            setWarning({
                email: !credentials.email ? "Please provide email" : "",
                password: !credentials.password ? "Password can't be empty" : ""
            });
            return;
        }

        try {
            setLoading(true);

            
            const data = await login(credentials.email, credentials.password);

            if (data.message === "Logged in successfully") {
               
                const userData = await getMe();
                setUser(userData);
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            console.log(err)
            const status = err.response?.status;
            if (status === 401) {
                setWarnMsg("Invalid email or password.");
            } else if (status === 500) {
                setWarnMsg("Server error. Please try again later.");
            } else {
                setWarnMsg("Something went wrong. Check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <Input
                    name="email"
                    label="Email"
                    placeholder="Enter your email id"
                    paddingClass="p-2"
                    icon="ic:outline-email"
                    inputWarning={warning.email}
                    onChange={handleChange}
                    bgClass="bg-surface"
                    value={credentials.email}
                />

                <div className="flex flex-col gap-1">
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
                    />

                    <p
                        onClick={() => navigate("/forgot-password")}
                        className="text-caption text-muted mt-2 cursor-pointer hover:text-brand transition-colors"
                    >
                        Forgot Password?
                    </p>
                </div>

                <Button
                    type="submit"
                    bgClass="bg-brand"
                    className="p-2 rounded-lg"
                    buttonName={loading ? "Logging in..." : "Login"}
                    disabled={loading}
                />
            </form>

            {/* Social Links Section */}
            <div className="flex gap-3 py-10">
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

export default Login;