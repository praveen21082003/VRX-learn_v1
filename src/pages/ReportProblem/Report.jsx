import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { BackButton, Button, Input, Select, UploadSection } from "@/components/ui";


function Report() {

    const [files, setFiles] = useState([]);

    const navigate = useNavigate();

    useDocumentTitle("❗ Report a Problem");

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/dashboard');
        }
    }


    return (
        <div className='space-y-4 px-6 py-8'>
            <BackButton label='Back' onClick={handleBack} />
            <>
                <div className='space-y-2'>
                    <h3 className='text-h3'>Report a problem</h3>
                    <p className='text-body text-muted'>Please provide details about the issue you encountered. Your feedback helps us improve the learning experience.</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input
                        label="Subject"
                        placeholder="Brief summary of the problem"
                        inputheight="h-11"
                    />
                    <Select
                        inputLabel="Category"
                        label="Select a category:"
                        options={[
                            { label: "Course Contents & Materials", value: "course_contents" },
                            { label: "Assignments", value: "assignments" },
                            { label: "Account & Access", value: "account_access" },
                            { label: "Technical Bug", value: "technical_bug" },
                            { label: "Other", value: "other" },
                        ]}
                        paddingClass="p-4"
                        borderClass="border-input-border"
                        inputheight="h-11"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-h5">Short description</label>
                    <textarea
                        rows="6"
                        // value={formData.shortDescription}
                        // onChange={(e) =>
                        //     handleChange("shortDescription", e.target.value)
                        // }
                        className="w-full border text-body bg-input-bg border-input-border rounded p-3 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                </div>

                <UploadSection
                    label="Attachment"
                    files={files}
                    setFiles={(newFiles) => {
                        setFiles(newFiles);
                        // setWarning(prev => ({ ...prev, file: null }));
                    }}
                    allowedTypes={['jpeg', 'jpg', 'png']}
                    maxFileSize={2}
                />
            </>
            <div className='flex justify-center'>
                <Button
                    buttonName="Submit Report"
                    className="mt-5 px-5 py-2 rounded"
                />
            </div>
        </div>
    )
}

export default Report
