import React, { useState, useEffect } from "react";
import { Input, Select, Button, DeleteConfirmContent } from "@/components/ui";

import { useUserActions } from "./hooks/useUserActions";

import { useToast } from "@/context/ToastProvider";

function UserForm({ initialData, onSubmit, onSuccess, onClose, mode }) {
  const { addToast } = useToast();

  //  CD hook
  const {
    createNewUser,
    deleteUser,

    creating,
    deleting,

    error,
    setError,
  } = useUserActions();

  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "trainee",
  });

  const [errors, setErrors] = useState({});

  // To load initial Data if present, for update old to new
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        email: initialData.email || "",
        password: "", // keep passwords empty on edit
        confirmPassword: "",
        role: initialData.role || "trainee",
      });
    }
  }, [initialData]);

  // Error Validation Function

  const validate = () => {
    let tempErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      tempErrors.username = "Username is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else {
      const email = formData.email.trim();

      // Strong email regex
      const emailRegex =
        /^[a-zA-Z0-9]+([.]?[a-zA-Z0-9]+)@[a-zA-Z0-9]+([.]?[a-zA-Z0-9]+)\.[a-zA-Z]{2,}$/;

      // Check multiple @
      const atCount = (email.match(/@/g) || []).length;

      if (atCount > 1) {
        tempErrors.email = "Email can contain only one @";
      }
      // Consecutive dots
      else if (email.includes("..")) {
        tempErrors.email = "Email cannot contain consecutive dots";
      }
      // Dot before @
      else if (email.includes(".@")) {
        tempErrors.email = "Dot cannot come before @";
      }
      // Invalid format
      else if (!emailRegex.test(email)) {
        tempErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation (create mode only)
    if (mode === "create") {
      if (!formData.password) {
        tempErrors.password = "Password is required";
      }

      if (!formData.confirmPassword) {
        tempErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (field, value) => {
    let updatedValue = value;

    if (field === "username") {
      updatedValue = value
        .replace(/[^a-zA-Z0-9\s.-]/g, "")
        .replace(/\.{2,}/g, ".") // remove emoji, numbers, symbols
        .replace(/\s+/g, " ") // avoid multiple spaces
        .replace(/^\s/, ""); // prevent starting space
    }

    // Email restriction
    if (field === "email") {
      updatedValue = value
        .replace(/[^a-zA-Z0-9@.]/g, "") // allow only letters, numbers, @ and .
        .toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEdit) {
        // edit logic ones ready
      } else {
        const payload = {
          ...formData,
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
        };

        const response = await createNewUser(payload);

        if (response.success) {
          addToast(response.message, "success");
          onSuccess?.(response.data);
          onClose?.();
        } else {
          if (response.status === 409) {
            setErrors((prev) => ({
              ...prev,
              email: "A user with this email already exists.",
            }));
            return;
          }
          if (response.status === 400) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: "Password and confirm password do not match.",
            }));
            return;
          }
          addToast(response.message, "error");
          addToast(response.message, "error");
        }
      }
    }
  };

  const handleActionDelete = async (id) => {
    const response = await deleteUser(id);
    if (response?.success) {
      addToast(response.message, "success");
      onSuccess?.();
      onClose?.();
    } else {
      addToast(response.message || "Delete failed", "error");
    }
  };

  return (
    <>
      {mode === "delete" ? (
        <DeleteConfirmContent
          confirmText={initialData?.name || ""}
          entityName="user"
          message={
            <span>
              You are about to completely delete{" "}
              <strong className="font-bold text-main">
                {" "}
                {initialData?.name}{" "}
              </strong>{" "}
              from the system. This will instantly erase their login access,
              active course enrollments, global grade history, and all submitted
              coursework.
            </span>
          }
          loading={deleting}
          onClose={onClose}
          onConfirm={() => handleActionDelete(initialData.id)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Enter username"
            inputWarning={errors.username}
          />
          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            autoComplete="email"
            placeholder="Enter email"
            inputWarning={errors.email}
          />
          <Select
            inputLabel="Role"
            name="role"
            options={[
              { label: "Admin", value: "admin" },
              { label: "Trainer", value: "trainer" },
              { label: "Trainee", value: "trainee" },
            ]}
            borderClass="border-input-border"
            value={formData.role}
            onChange={(val) => handleChange("role", val)}
            inputWarning={errors.role}
          />
          {mode === "create" && (
            <>
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                autoComplete="new-password"
                placeholder="Enter password"
                inputWarning={errors.password}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                autoComplete="new-password"
                placeholder="Confirm password"
                inputWarning={errors.confirmPassword}
              />
            </>
          )}
          <div className="flex w-full gap-3">
            <Button
              buttonName="Cancel"
              className="px-4 py-2 rounded-lg w-full"
              bgClass=""
              textClass=""
              onClick={onClose}
            />
            <Button
              disabled={creating}
              type="submit"
              buttonName={
                creating
                  ? "Processing..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create User"
              }
              className="px-4 py-2 rounded-lg w-full"
            />
          </div>
        </form>
      )}
    </>
  );
}

export default UserForm;