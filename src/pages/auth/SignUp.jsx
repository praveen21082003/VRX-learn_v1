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
    let updatedValue = value;
    // Username restriction while typing
    if (name === "username") {
      updatedValue = value
        .replace(/[^a-zA-Z0-9\s.'.]/g, "") 
        .replace(/\s+/g, " ") 
        .replace(/^\s/, "");
    }

    if (name === "email") {
      updatedValue = value
        .replace(/[^a-zA-Z0-9@.]/g, "") // allow only letters, numbers, @ and .
        .toLowerCase();
    }

    setCredentials((prev) => ({ ...prev, [name]: updatedValue }));
    if (warning[name]) setWarning((prev) => ({ ...prev, [name]: "" }));
    if (bannerMsg) setBannerMsg("");
  };

  // const icons = [
  //     { key: "web", name: "mdi:web", navlink: "https://vrnexgen1.com/", hover: "hover:text-blue-500" },
  //     { key: "linkedin", name: "mdi:linkedin", navlink: "https://www.linkedin.com/company/vrnexgen/", hover: "hover:text-blue-600" },
  //     { key: "youtube", name: "mdi:youtube", navlink: "https://www.youtube.com/@VRNeXGen1/", hover: "hover:text-red-500" },
  //     { key: "github", name: "mdi:github", navlink: "#", hover: "hover:text-black" },
  // ];

  // validation function
  const validateForm = () => {
    const newWarnings = {};

    // Username validation
    if (!credentials.username.trim()) {
      newWarnings.username = "Please provide username";
    }

    // Email validation
    if (!credentials.email.trim()) {
      newWarnings.email = "Please provide email";
    } else {
      const email = credentials.email.trim();

      // Basic email format
      const emailRegex =
        /^[a-zA-Z0-9]+([.]?[a-zA-Z0-9]+)@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)\.[a-zA-Z]{2,}$/;

      // multiple @
      const atCount = (email.match(/@/g) || []).length;

      if (atCount > 1) {
        newWarnings.email = "Email can contain only one @";
      }
      // continuous dots
      else if (email.includes("..")) {
        newWarnings.email = "Email cannot contain consecutive dots";
      }
      // dot before @
      else if (email.includes(".@")) {
        newWarnings.email = "Dot cannot come before @";
      }
      // invalid email format
      else if (!emailRegex.test(email)) {
        newWarnings.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!credentials.password) {
      newWarnings.password = "Password can't be empty";
    }

    if (!credentials.confirmPassword) {
      newWarnings.confirmPassword = "Please confirm your password";
    } else if (credentials.password !== credentials.confirmPassword) {
      newWarnings.confirmPassword = "Passwords do not match";
    }

    setWarning(newWarnings);

    return Object.keys(newWarnings).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerMsg("");

    // frontend validation
    if (!validateForm()) return;

    const payload = {
      ...credentials,
      username: credentials.username.trim(),
      email: credentials.email.trim().toLowerCase(),
    };

    const response = await handleSignup(payload);

    if (!response.success) {
      if (response.status === 409) {
        // email already exists — set as field warning
        setWarning((prev) => ({
          ...prev,
          email: "An account with this email already exists.",
        }));
      } else {
        // all other errors — show in banner
        setBannerMsg(response.message);
        setBannerType("error");
      }
      return;
    }

    // success
    setBannerMsg(
      "Please check your email for the verification link to complete registration.",
    );
    setBannerType("success");
    setCredentials({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      {bannerMsg && <StatusBanner type={bannerType} message={bannerMsg} />}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1.5 w-full pb-10"
      >
        <Input
          name="username"
          label="Full Name"
          placeholder="Enter your full name"
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
          <span
            onClick={() => navigate("/login")}
            className="text-[#0088ff] font-bold cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>

      {/* <div className="flex gap-3 py-2">
                {icons.map((i) => (
                    <a key={i.key} href={i.navlink} target="_blank" rel="noopener noreferrer">
                        <Icon
                            name={i.name}
                            height="28"
                            width="28"
                            className={text-muted ${i.hover} transition-colors duration-200}
                        />
                    </a>
                ))}
            </div> */}
    </>
  );
}

export default SignUp;