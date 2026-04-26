import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Input, SearchSelect, Select, TextEditor, Icon, Button, DeleteConfirmContent, InputWarnMessage } from '@/components/ui'
import { useToast } from '@/context/ToastProvider'


import useDebouncedSearch from './hooks/useDebouncedSearch';
import { useCourseActions } from './hooks/useCourseActions';

import { searchUser } from '../../services/AdminSearch.service';

function CourseForm({ initialData,
    onClose,
    onSuccess,
    mode,
}) {
    const isEdit = mode === "edit";

    const { addToast } = useToast();
    const {
        createNewCourse,
        updateCourse,
        deleteCourse,
        creating,
        updating,
        deleting,
    } = useCourseActions();



    const [isOpen, setIsOpen] = useState(!!initialData?.longDescription);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        shortDescription: initialData?.shortDescription || "",
        longDescription: initialData?.longDescription || "",
        trainerId: initialData?.trainerId || "",
    });
    const [warning, setWarning] = useState({});


    // Get intial data for update
    useEffect(() => {
        if (isEdit && initialData?.trainerName) {
            setSearch(initialData.trainerName);
        }
    }, [isEdit, initialData]);


    const handleSearchUser = useCallback(async ({ query, role }) => {
        return await searchUser({
            username_or_email: query,
            role
        });
    }, []);

    const memoizedParams = useMemo(() => ({
        role: "trainer"
    }), []);

    const { search, setSearch, results, searching } = useDebouncedSearch({
        searchFn: handleSearchUser,
        extraParams: memoizedParams
    });





    // Handle Change Fuction 
    const handleChange = (field, value) => {

        const processedValue = field === "title" ? value.toUpperCase() : value;

        setFormData(prev => ({ ...prev, [field]: processedValue }));
        setWarning(prev => ({
            ...prev,
            [field]: null
        }));
        if (field === "shortDescription") {
            const trimmed = value?.trim();
            if (trimmed && trimmed.length > 600) {
                setWarning(prev => ({ ...prev, shortDescription: `Max 600 characters (${trimmed.length}/600)` }));
            }
        }

        if (field === "longDescription") {
            const trimmed = value?.trim();
            if (trimmed && trimmed.length > 5000) {
                setWarning(prev => ({ ...prev, longDescription: `Max 5000 characters (${trimmed.length}/5000)` }));
            }
        }
    }



    const validate = () => {
        const errors = {};

        // title — required only, no length limit
        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        // trainer required
        if (!formData.trainerId) {
            errors.trainerId = "Please select a trainer";
        }

        // short description — optional, max 600 only
        const shortDesc = formData.shortDescription?.trim();
        if (shortDesc && shortDesc.length > 600) {
            errors.shortDescription = `Short description must be under 600 characters (${shortDesc.length}/600)`;
        }

        // long description — optional, max 5000 only
        const longDesc = formData.longDescription?.trim();
        if (longDesc && longDesc.length > 5000) {
            errors.longDescription = `Description must be under 5000 characters (${longDesc.length}/5000)`;
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setWarning(errors);
            return;
        }

        if (isEdit) {
            // update payload — only changed fields
            const payload = {};
            if (formData.title.trim() !== (initialData?.title || "").trim()) {
                payload.title = formData.title.trim();
            }
            if (formData.trainerId !== initialData?.trainerId) {
                payload.trainerId = formData.trainerId;
            }
            if (formData.shortDescription?.trim() !== (initialData?.shortDescription || "").trim()) {
                payload.shortDescription = formData.shortDescription?.trim() || null;
            }
            if (formData.longDescription?.trim() !== (initialData?.longDescription || "").trim()) {
                payload.longDescription = formData.longDescription?.trim() || null;
            }
            if (formData.thumbnail !== initialData?.thumbnail) {
                payload.thumbnail = formData.thumbnail || null;
            }

            if (Object.keys(payload).length === 0) {
                addToast("No changes made", "info");
                return;
            }

            const response = await updateCourse(initialData.id, payload);
            // console.log(payload);
            if (response.success) {
                addToast(response.message, "success");
                onSuccess(response.data, "update");
                onClose?.();
            } else {
                addToast(response.message, "error");
            }

        } else {
            // create payload — send null for empty optional fields
            const payload = {
                title: formData.title.trim(),
                trainerId: formData.trainerId,
                thumbnail: null,
                shortDescription: formData.shortDescription?.trim() || null,
                longDescription: formData.longDescription?.trim() || null,
                details: {
                    type: "live",
                    totalHours: 1,
                    price: 1001,
                },
            };

            const response = await createNewCourse(payload);
            console.log(payload);

            if (response.success) {
                addToast(response.message, "success");
                onSuccess(response.data, "create");
                onClose?.();
            } else {
                addToast(response.message, "error");
            }
        }
    };

    // ADD: delete handler
    const handleActionDelete = async (id) => {
        const response = await deleteCourse(id);
        if (response?.success) {
            addToast(response.message, "success");
            onSuccess({ id }, "delete");
            onClose?.();
        } else {
            addToast(response.message || "Delete failed", "error");
        }
    };

    // ADD: delete mode - render confirm screen instead of form
    if (mode === "delete") {
        return (
            <DeleteConfirmContent
                confirmText={initialData?.title || ""}
                entityName="course"
                message={
                    <span>
                        You are about to permanently delete{" "}
                        <strong className="font-bold text-main">{initialData?.title}</strong>.
                        All associated materials, student progress, and data tied to this course
                        will be permanently erased from the system.
                    </span>
                }
                loading={deleting}
                onClose={onClose}
                onConfirm={() => handleActionDelete(initialData.id)}
            />
        );
    }


    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
                label="Title"
                placeholder="Enter course title"
                paddingClass="p-2"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                inputWarning={warning.title}
            />

            <SearchSelect
                label="Trainers"
                value={search}
                onChange={(value) => {
                    setSearch(value);
                    if (!value) {
                        handleChange("trainerId", "");
                    }
                }}
                results={results}
                loading={searching}
                getLabel={(item) => item.username}
                getSubLabel={(item) => item.email}
                onSelect={(item) => {
                    handleChange("trainerId", item.id);
                    setSearch(item.username);
                }}
                inputWarning={warning.trainerId}
            />

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Short Description</label>
                <textarea
                    rows={4}
                    className="w-full p-3 rounded-md  text-sm leading-relaxed resize-none overflow-hidden border  focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="Briefly describe what this course covers (minimum 50 characters if provided)"
                    value={formData.shortDescription || ""}
                    onChange={(e) => handleChange("shortDescription", e.target.value)}
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                />
                {warning.shortDescription && <InputWarnMessage message={warning.shortDescription} />}
            </div>
            {!isOpen &&
                <div className="flex justify-between" onClick={() => setIsOpen((prev) => !prev)}>
                    <label className="text-h5">Add Long Description<span className="text-caption">(optional)</span></label>
                    <Icon name="iconamoon:arrow-down-2" />
                </div>
            }

            {isOpen &&
                <div>
                    <label className="text-h5">Description</label>
                    <TextEditor
                        value={formData.longDescription}
                        onChange={(value) => handleChange("longDescription", value)}
                        inputWarning={warning.longDescription}
                        placeholder="Provide a detailed description of the course, including key topics and outcomes"
                    />
                </div>
            }


            {/* Actions */}
            <div className="flex w-full gap-3">
                <Button
                    type="button"
                    buttonName="Cancel"
                    className="px-4 py-2 rounded-lg w-full"
                    variant="outline"
                    onClick={onClose}
                    bgClass=""
                    textClass=""
                />
                <Button
                    type="submit"
                    buttonName={creating || updating ? "Processing..." : isEdit ? "Save Changes" : "Add Course"}
                    disabled={creating || updating}
                    className="px-4 py-2 rounded-lg w-full"
                    type="submit"
                />
            </div>
        </form>
    )
}

export default CourseForm
