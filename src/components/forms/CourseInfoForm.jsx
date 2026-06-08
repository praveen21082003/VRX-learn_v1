import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useCourseActions } from "./hooks/useCourseActions";
import useDebouncedSearch from "./hooks/useDebouncedSearch";
import { useScrollToError } from '@/hooks/useScrollToError';

import { searchUser } from "../../services/AdminSearch.service";

import { useToast } from '@/context/ToastProvider'
import { usePermission } from '@/hooks/usePermission'

import { Input, CourseTumbnail, Button, TextEditor, SearchSelect, TextArea } from '@/components/ui'





function CourseInfoForm({ courseInfo, onSuccess, setIsRefresh }) {
    const refs = {
        title: useRef(null),
        trainerId: useRef(null),
    };

    // hooks, context
    const scrollToError = useScrollToError(refs);
    const { addToast } = useToast();
    const { can } = usePermission();

    const courseId = courseInfo?.id;

    const handleSearchUser = useCallback(async ({ query, role }) => {
        return await searchUser({
            username_or_email: query,
            role,
        });
    }, []);

    const memoizedParams = useMemo(
        () => ({
            role: "trainer",
        }),
        [],
    );

    const { search, setSearch, results, searching } = useDebouncedSearch({
        searchFn: handleSearchUser,
        extraParams: memoizedParams,
    });

    const {
        updateCourse,
        updating,
        error
    } = useCourseActions();

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        trainerName: "",
        trainerId: "",
        shortDescription: "",
        longDescription: "",
        thumbnail: null
    });

    const [warning, setWarning] = useState({
    });


    useEffect(() => {
        if (courseInfo) {
            setFormData({
                title: courseInfo.title || "",
                trainerName: courseInfo.trainerName || "",
                trainerId: courseInfo.trainerId || "",
                shortDescription: courseInfo.shortDescription || "",
                longDescription: courseInfo.longDescription || "",
                thumbnail: courseInfo.thumbnail || null
            });

            setSearch(courseInfo.trainerName || "");
        }
    }, [courseInfo]);


    // handle Function
    const handleChange = (field, value) => {
        value = value.replace(/\s+/g, " ").trim();

        setFormData(prev => ({ ...prev, [field]: value }));

        setWarning(prev => ({ ...prev, [field]: "" }));

    };

    // Handle thumbnail upload file handleing
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);

        setFormData((prev) => ({
            ...prev,
            thumbnail: imageURL,
        }));

    };


    // validation function
    const validateForm = (formData, canEditAuthor) => {
        const errors = {};

        if (!formData.title?.trim()) {
            errors.title = "Course title cannot be empty.";
        }

        if (canEditAuthor && !formData.trainerId) {
            errors.trainerId = "Please select a valid author.";
        }

        if (formData.shortDescription?.length > 600) {
            errors.shortDescription =
                "Short description cannot exceed 600 characters.";
        }

        return errors;
    };



    // handle submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDATION FIRST
        const validationErrors = validateForm(formData, can('UPDATE_AUTHOR'));

        if (Object.keys(validationErrors).length > 0) {
            setWarning(validationErrors);
            scrollToError(validationErrors);
            return;
        }

        const payload = {};

        if (formData.title !== (courseInfo?.title || "")) {
            payload.title = formData.title.trim() || null;
        }

        if (
            formData.shortDescription !==
            (courseInfo?.shortDescription || "")
        ) {
            payload.shortDescription =
                formData.shortDescription.trim() || null;
        }

        if (
            formData.longDescription !==
            (courseInfo?.longDescription || "")
        ) {
            payload.longDescription =
                formData.longDescription.trim() || null;
        }

        if (formData.trainerId !== courseInfo?.trainerId) {
            payload.trainerId = formData.trainerId || null;
        }

        // always send these for now
        payload.thumbnail = null;

        const editedFields = Object.keys(payload).filter(
            (key) =>
                key !== "thumbnail" &&
                payload[key] !== undefined
        );

        if (editedFields.length === 0) {
            addToast("No changes detected.Please Update the Fields first", "info");
            return;
        }

        const response = await updateCourse(courseId, payload);

        const newWarning = {};

        if (response.status === 409) {
            newWarning.title = "A course with this title already exists.";
        }

        if (response.status === 400) {
            newWarning.trainerId = "The selected user is not a trainer.";
        }

        if (response.status === 404) {
            newWarning.trainerId = "Trainer not found. Please select a valid trainer.";
        }

        if (Object.keys(newWarning).length > 0) {
            setWarning(newWarning);
            scrollToError(newWarning);
            return;
        }

        addToast(
            response.message,
            response.success ? "success" : "error"
        );
        if (response.success && onSuccess) {
            onSuccess(payload);
            setIsRefresh(true);
        }
    };



    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col-reverse md:flex-row gap-4 md:h-49">
                <div className="flex flex-col gap-8 md:w-[65%] xl:w-[70%] justify-end">
                    <div ref={refs.title} className="flex flex-col gap-1 min-h-18">
                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            bgClass="bg-input-bg"
                            inputWarning={warning.title}
                        />
                    </div>


                    {can('UPDATE_AUTHOR')
                        ? (
                            <div ref={refs.trainerId} className="flex flex-col gap-1 min-h-18">
                                <SearchSelect
                                    label="Author"
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
                                    placeholder="Search by username or email"
                                    onSelect={(item) => {
                                        handleChange("trainerId", item.id);
                                        setSearch(item.username);
                                    }}
                                    inputWarning={warning.trainerId}
                                    paddingClass="py-2.5"
                                />
                            </div>

                        ) : (
                            <Input
                                label="Author"
                                value={formData.trainerName}
                                disabled
                                title="Cant edit author"
                                bgClass="bg-input-bg"
                                inputWarning={warning.trainerId}
                            />
                        )
                    }
                </div>
                <div className="relative noise-overlay flex flex-col md:w-[35%]  xl:w-[30%]">
                    <CourseTumbnail
                        name={formData.title}
                        image={formData.thumbnail}
                        classRounded="rounded-t-sm"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled
                    />


                    <Button
                        type="button"
                        buttonName="Upload"
                        frontIconName="material-symbols:upload"
                        frontIconHeight="28px"
                        frontIconWidth="28px"
                        className="w-full p-1 rounded-b"
                        textClass="text-h5"
                        bgClass="bg-primary/16 dark:bg-surface-primary-dark"
                        onClick={() => fileInputRef.current.click()}
                        title="You can't upload tumbnail, "
                    />

                </div>
            </div>


            <TextArea
                label="Short Description"
                placeholder="Enter a brief description of the course"
                value={formData.shortDescription}
                onChange={(e) =>
                    handleChange("shortDescription", e.target.value)
                }
                warning={warning.shortDescription}
                autoResize
                maxLength={600}
                showCount
            />
            <div>
                <label className="text-h5">Description</label>
                <TextEditor
                    value={formData.longDescription}
                    onChange={(value) =>
                        handleChange("longDescription", value)
                    }
                />

            </div>

            <div className="flex justify-center">
                <Button
                    type="submit"
                    buttonName={updating ? "Saving..." : "Save Changes"}
                    className="p-3 rounded"
                    disabled={updating}
                />
            </div>


        </form >
    )
}

export default CourseInfoForm
