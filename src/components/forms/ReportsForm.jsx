import React, { useState } from 'react'

import { useCreateReport } from './hooks/useCreateReport';
import { useToast } from '@/context/ToastProvider';

import { BackButton, Button, Input, Select, UploadSection, InputWarnMessage } from "@/components/ui";
import { useNavigate } from 'react-router-dom';

function ReportsForm() {

    const { addToast } = useToast();
    const navigate = useNavigate();

    // hook
    const {
        createReport,
        creating,
        error,
        setError,
        uploadProgress,
        loadedData,
        mediaStatus,
    } = useCreateReport();

    // states
    const [formData, setFormData] = useState({
        subject: "",
        category: null,
        description: ""
    });

    const [files, setFiles] = useState([]);
    const [warning, setWarning] = useState({});



    // validation function
    const validateForm = () => {
        const errors = {};

        // Subject validation
        const trimmedSubject = formData.subject.trim();

        if (!trimmedSubject) {
            errors.subject = "Subject is required";
        } else if (trimmedSubject.length < 10) {
            errors.subject = "Subject must be at least 10 characters";
        } else if (trimmedSubject.length > 100) {
            errors.subject = "Subject cannot exceed 100 characters";
        }


        // Category validation
        const allowedCategories = [
            "account-access",
            "assignment",
            "bug",
            "course-content",
            "other",
        ];

        if (!allowedCategories.includes(formData.category)) {
            errors.category = "Select any Category."
        }


        // Description validation
        if (formData.description?.trim().length > 2000) {
            errors.description = "Description cannot exceed 2000 characters";
        }

        // File validation
        if (files.length > 0) {
            const file = files[0];

            const allowedTypes = [
                "image/jpeg",
                "image/png",
            ];

            if (!allowedTypes.includes(file.type)) {
                errors.file = "Only JPG, JPEG, and PNG files are allowed";
            }

            const maxSize = 2 * 1024 * 1024; // 2MB

            if (file.size > maxSize) {
                errors.file = "File size must be less than 2MB";
            }
        }

        setWarning(errors);

        return Object.keys(errors).length === 0;
    };



    // handle functions

    // handle change
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        setWarning(prev => ({
            ...prev,
            [field]: null
        }));
    }

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) return;

        const payload = {
            issue: {
                subject: formData.subject.trim(),
                category: formData.category,
                description: formData.description.trim() || null,
            },
            fileMetadata: files[0]
                ? {
                    filename: files[0].name,
                    content_type: files[0].type,
                    size: files[0].size,
                }
                : null,
        };


        const response = await createReport(payload, files[0] || null);

        if (response.success) {

            addToast(
                response.message || "Report submitted successfully",
                "success"
            );

            // reset form
            setFormData({
                subject: "",
                category: "account-access",
                description: "",
            });

            setFiles([]);
            setWarning({});

            // go back to previous page
            navigate(-1);

        } else {

            addToast(
                response.message || "Failed to submit report",
                "error"
            );
        }
    };


    return (
        <form onSubmit={handleSubmit} className='space-y-2 text-main'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                    label="Subject"
                    placeholder="Brief summary of the problem"
                    inputheight="h-11"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    inputWarning={warning.subject}
                />
                <div className='space-y-2'>
                    <Select
                        inputLabel="Category"
                        // label=""
                        options={[
                            { label: "--Select--", value: null },
                            { label: "Course Contents & Materials", value: "course-content" },
                            { label: "Assignments", value: "assignment" },
                            { label: "Account & Access", value: "account-access" },
                            { label: "Technical Bug", value: "bug" },
                            { label: "Other", value: "other" },
                        ]}
                        paddingClass="p-4"
                        borderClass="border-input-border"
                        inputheight="h-11"
                        value={formData.category}
                        onChange={(val) => handleChange("category", val)}
                    />
                    {warning.category && <InputWarnMessage message={warning.category} />}
                </div>

            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-h5">Description</label>
                </div>

                <textarea
                    rows="6"
                    maxLength={2000}
                    value={formData.description}
                    onChange={(e) =>
                        handleChange("description", e.target.value)
                    }
                    placeholder='Please tell us exactly what went wrong. Include what you were trying to do, what happened instead, and any error messages you saw.'
                    className="w-full border text-body bg-input-bg border-input-border rounded p-3 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <div className='flex justify-between'>
                    <div>
                        {warning.description && (
                            <InputWarnMessage message={warning.description} />
                        )}
                    </div>
                    <span
                        className={`text-small ${formData.description.length >= 2000
                            ? "text-red-500"
                            : "text-muted-foreground"
                            }`}
                    >
                        {formData.description.length}/2000
                    </span>


                </div>

            </div>

            <UploadSection
                label="Attachment"
                files={files}
                setFiles={(newFiles) => {
                    setFiles(newFiles);
                    setWarning(prev => ({ ...prev, file: null }));
                }}
                uploadProgress={uploadProgress}
                isUploading={creating}
                isUploaded={uploadProgress === 100}
                mediaStatus={mediaStatus}
                allowedTypes={['jpeg', 'jpg', 'png', 'pdf']}
                maxFileSize={2}
                inputWarning={warning.file}
            />

            <div className='flex justify-center'>
                <Button
                    type="submit"
                    disabled={creating}
                    buttonName={creating ? "Submitting..." : "Submit Report"}
                    className="mt-5 px-5 py-2 rounded"
                />
            </div>

        </form >
    )
}

export default ReportsForm
