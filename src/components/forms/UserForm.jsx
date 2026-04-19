import React, { useState } from 'react'
import { Input, Select, Button } from '@/components/ui'

function UserForm({ initialData, onSubmit, loading, onClose, mode }) {
    const [formData, setFormData] = useState({
        username: initialData?.username || "",
        email: initialData?.email || "",
        password: "",
        confirmPassword: "",
        role: initialData?.role || "trainee",
    });


    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }


    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            <Input name="username" label="Username" value={formData.username} onChange={(val) => handleChange("username", val)} />
            <Input name="email" label="Email" value={formData.email} onChange={(val) => handleChange("email", val)} autoComplete="new-password" />
            <Select
                name="role"
                inputLabel="Role"
                options={[
                    { label: "Admin", value: "admin" },
                    { label: "Trainer", value: "trainer" },
                    { label: "Trainee", value: "trainee" }
                ]}
                borderClass="border-input-border"
                value={formData.role}
                onChange={(val) => handleChange("role", val)}
            // inputWarning={warnings.role}
            />
            {mode === "create" && (
                <>
                    <Input name="password" type="password" label="Password" onChange={(val) => handleChange("password", val)} autoComplete="new-password" />
                    <Input name="confirmPassword" type="password" label="Confirm Password" onChange={(val) => handleChange("confirmPassword", val)} autoComplete="new-password" />
                </>
            )}
            <div className='flex w-full gap-3'>
                <Button
                    buttonName="Cancel"
                    className="px-4 py-2 rounded-lg w-full"
                    bgClass=""
                    textClass=""
                    onClick={onClose}
                />
                <Button
                    disabled={loading}
                    type="submit"
                    buttonName={
                        loading
                            ? "Processing..."
                            : mode === "edit"
                                ? "Save Changes"
                                : "Create User"
                    }
                    className="px-4 py-2 rounded-lg w-full"

                />
            </div>

        </form>
    )
}

export default UserForm
