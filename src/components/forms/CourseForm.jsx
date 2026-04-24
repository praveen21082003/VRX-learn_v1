import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Input, SearchSelect,Select, TextEditor, Icon, Button ,DeleteConfirmContent} from '@/components/ui'
import { useToast } from '@/context/ToastProvider'   


import useDebouncedSearch from './hooks/useDebouncedSearch';

import { searchUser } from '../../services/AdminSearch.service';

function CourseForm({  initialData,
    onClose,
    onSuccess,
    mode,
    loading,
    isEdit,
    creating,
    updating,
    deleting,
    createNewCourse,    
    updateCourse,       
    deleteCourse,        }) {
    const { addToast } = useToast();   

   

    const [isOpen, setIsOpen] = useState(!!initialData?.longDescription);

   const [formData, setFormData] = useState({
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    longDescription: initialData?.longDescription || "",
    trainerId: initialData?.trainerId || "",
});
    console.log(formData)


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
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

  // ADD: submit handler
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log("Sending payload:", formData);  

    //     if (isEdit) {
    //         const response = await updateCourse(initialData.id, formData);
    //         if (response.success) {
    //             addToast(response.message, "success");
    //             onSuccess?.(response.data);
    //             onClose?.();
    //         } else {
    //             addToast(response.message, "error");
    //         }
    //     } else {
    //         const response = await createNewCourse(formData);
    //         if (response.success) {
    //             addToast(response.message, "success");
    //             onSuccess?.(response.data);
    //             onClose?.();
    //         } else {
    //             addToast(response.message, "error");
    //         }
    //     }
    // };

const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        title: formData.title,
        trainerId: formData.trainerId,
        thumbnail: "",
        details: {                        // hardcoded default, hidden from UI
            type: "pre-recorded",
            totalHours: 1,
            price: 1001,
        },
        ...(formData.shortDescription?.trim() && { shortDescription: formData.shortDescription.trim() }),
        ...(formData.longDescription?.trim() && { longDescription: formData.longDescription.trim() }),
    };

    if (isEdit) {
        const response = await updateCourse(initialData.id, payload);
        if (response.success) {
            addToast(response.message, "success");
            onSuccess?.(response.data);
            onClose?.();
        } else {
            addToast(response.message, "error");
        }
    } else {
        const response = await createNewCourse(payload);
        if (response.success) {
            addToast(response.message, "success");
            onSuccess?.(response.data);
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
            onSuccess?.();
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
            // inputWarning={warnings.title}
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
            // inputWarning={warnings.trainerId}
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
                {/* {warnings.shortDescription && <InputWarnMessage message={warnings.shortDescription} />} */}
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
                        // inputWarning={warnings.longDescription}
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
                    type="button"
                    bgClass=""
                    textClass=""
                />
                <Button
                type="submit"
                    buttonName={loading ? "Processing..." : isEdit ? "Save Changes" : "Add Course"}
                    className="px-4 py-2 rounded-lg w-full"
                    disabled={creating || updating}
                    type="submit"
                />
            </div>
        </form>
    )
}

export default CourseForm
