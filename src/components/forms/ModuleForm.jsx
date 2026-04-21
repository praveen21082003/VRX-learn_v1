import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Input, TextEditor, Button } from '@/components/ui'
import { useModulesAction } from './hooks/useModulesAction'
import { useToast } from '@/context/ToastProvider'

function ModuleForm({ mode, initialData, setModules, modules, courseId }) {
    const isEdit = mode === "edit";
    const navigate = useNavigate();
    const { addToast } = useToast();

    const { createNewModule, updateModule, creating, updating } = useModulesAction();

    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    // populate form in edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
            });
        }
    }, [isEdit, initialData]);

    const [warning, setWarning] = useState({});

    // handle Change
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // clear warning on change
        setWarning((prev) => ({ ...prev, [field]: null }));
    };

    // validation
    const validate = () => {
        const errors = {};
        const trimmedDesc = formData.description.trim();

        if (!formData.title.trim()) errors.title = "Title is required";
        if (trimmedDesc.length > 0 && trimmedDesc.length < 20) {
            errors.description = "Description must be at least 20 characters long"
        }
        return errors;
    };

    // build payload for update — only changed fields, no nulls
    const buildUpdatePayload = () => {
        const payload = {};
        if (formData.title.trim() !== (initialData?.title || "").trim()) {
            payload.title = formData.title.trim();
        }
        if (formData.description.trim() !== (initialData?.description || "").trim()) {
            payload.description = formData.description.trim();
        }
        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setWarning(errors);
            return;
        }

        if (isEdit) {
            const payload = buildUpdatePayload();

            // nothing changed
            if (Object.keys(payload).length === 0) {
                addToast("No changes made", "info");
                return;
            }

            const result = await updateModule(initialData.id, payload);

            if (!result.success) {
                addToast(result.message, "error");
                return;
            }

            // update context
            const updated = modules.map(m =>
                m.id === initialData.id ? { ...m, ...payload } : m
            );
            setModules(updated);

            addToast(result.message, "success");

        } else {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                courseId: courseId
            };

            console.log(payload)

            const result = await createNewModule(payload);

            if (!result.success) {
                addToast(result.message, "error");
                return;
            }

            // update context — add new module to list
            setModules([...modules, result.data]);

            addToast(result.message, "success");
            navigate(`/course/${courseId}/content/modules`);
        }
    };

    const isLoading = creating || updating;

    return (
        <form className='space-y-4' onSubmit={handleSubmit}>
            <Input
                label="Title"
                placeholder="Module name"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                inputWarning={warning.title}
            />
            <div className="space-y-2">
                <TextEditor
                    label="Description"
                    value={formData.description}
                    onChange={(value) => handleChange("description", value)}
                    inputWarning={warning.description}
                />
            </div>

            <div className='flex justify-center'>
                <Button
                    disabled={isLoading}
                    buttonName={
                        !isEdit
                            ? creating ? "Creating..." : "Add Module"
                            : updating ? "Updating..." : "Save Changes"
                    }
                    type="submit"
                    className="mt-5 px-5 py-2 rounded"
                />
            </div>
        </form>
    );
}

export default ModuleForm