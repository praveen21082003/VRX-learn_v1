import React, { useState, useEffect, useRef } from 'react'
import useUpdateCourseInfo from './hooks/useUpdateCourseInfo';
import { useToast } from '@/context/ToastProvider'

import { Input, CourseTumbnail, Button, TextEditor } from '@/components/ui'




function CourseInfoForm({ courseInfo, onSuccess }) {
    const { addToast } = useToast();

    const courseId = courseInfo?.id;
    const { updateCourseDetails, updating, error } = useUpdateCourseInfo();

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        trainerName: "",
        shortDescription: "",
        longDescription: "",
        thumbnail: null
    });


    useEffect(() => {
        if (courseInfo) {
            setFormData({
                title: courseInfo.title || "",
                trainerName: courseInfo.trainerName || "",
                shortDescription: courseInfo.shortDescription || "",
                longDescription: courseInfo.longDescription || "",
                thumbnail: courseInfo.thumbnail || null
            });
        }
    }, [courseInfo]);


    // handle Function
    const handleChange = (field, value) => {
        const processedValue = field === "title" ? value.toUpperCase() : value;

        setFormData(prev => ({ ...prev, [field]: processedValue }));
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


    // handle submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

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

        // always send these for now
        payload.thumbnail = null;
        payload.trainerId = null;

        const editedFields = Object.keys(payload).filter(
            (key) =>
                !["thumbnail", "trainerId"].includes(key) &&
                payload[key] !== undefined
        );

        if (editedFields.length === 0) {
            addToast("No changes detected.Please Update the Fields first", "warning");
            return;
        }

        const response = await updateCourseDetails(courseId, payload);

        addToast(
            response.message,
            response.success ? "success" : "error"
        );
        if (response.success && onSuccess) {
            onSuccess(payload);
        }
    };



    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col-reverse md:flex-row gap-4 md:h-49">
                <div className="flex flex-col gap-8 md:w-[65%] xl:w-[70%] justify-end">

                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        bgClass="bg-input-bg"
                    />
                    <Input
                        label="Author"
                        value={formData.trainerName}
                        disabled
                        title="Cant edit author"
                        bgClass="bg-input-bg"
                    />
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


            <div className="space-y-4">
                <label className="text-h5">Short description</label>
                <textarea
                    rows="6"
                    value={formData.shortDescription}
                    onChange={(e) =>
                        handleChange("shortDescription", e.target.value)
                    }
                    className="w-full border text-body bg-input-bg border-input-border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-brand"
                />
            </div>
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
