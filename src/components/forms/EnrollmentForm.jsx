import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { SearchSelect, Input, Button, Select, DeleteConfirmContent, InputWarnMessage } from '@/components/ui'
import { useToast } from '@/context/ToastProvider'
import { useEnrollmentActions } from './hooks/useEnrollmentActions'
import useDebouncedSearch from './hooks/useDebouncedSearch';
import { searchUser, searchCourse } from '../../services/AdminSearch.service';

function EnrollmentForm({ initialData, onClose, onSuccess, mode, isEdit }) {
    const { addToast } = useToast();
    const {
        createNewEnrollment,
        updateEnrollment,
        deleteEnrollment,
        creating,
        updating,
        deleting,
    } = useEnrollmentActions();

    const [formData, setFormData] = useState({
        userId: initialData?.userId || "",
        courseId: initialData?.courseId || "",
        status: initialData?.status || "in-progress",
        expireAt: initialData?.expireAt ? initialData.expireAt.split('T')[0] : "",
    });

    const [warning, setWarning] = useState({});

    // populate search fields in edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            setUserSearch(initialData.name);
            setCourseSearch(initialData.courseName);
        }
    }, [isEdit, initialData]);

    // search hooks
    const memoizedUserParams = useMemo(() => ({ role: ["trainee", "trainer"] }), []);

    const handleSearchUser = useCallback(async ({ query, role }) => {
        return await searchUser({ username_or_email: query, role });
    }, []);

    const handleSearchCourse = useCallback(async ({ query }) => {
        return await searchCourse({ query });
    }, []);

    const { search: userSearch, setSearch: setUserSearch, results: userResult, searching: searchingUser } = useDebouncedSearch({
        searchFn: handleSearchUser,
        extraParams: memoizedUserParams
    });

    const { search: courseSearch, setSearch: setCourseSearch, results: courseResults, searching: courseLoading } = useDebouncedSearch({
        searchFn: handleSearchCourse,
        delay: 500
    });

    // handle change
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setWarning(prev => ({ ...prev, [field]: null }));
    };

    // validation
    const validate = () => {
        const errors = {};

        if (!isEdit) {
            if (!formData.userId) errors.userId = "Please select a user";
            if (!formData.courseId) errors.courseId = "Please select a course";
        }

        return errors;
    };

    // build update payload — only changed fields, no nulls
    const buildUpdatePayload = () => {
        const payload = {};

        if (formData.status !== initialData?.status) {
            payload.status = formData.status;
        }

        const originalExpiry = initialData?.expireAt
            ? initialData.expireAt.split('T')[0]
            : "";

        if (formData.expireAt !== originalExpiry) {
            payload.expireAt = formData.expireAt || null;
        }

        return payload;
    };

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setWarning(errors);
            return;
        }

        if (isEdit) {
            const payload = buildUpdatePayload();

            if (Object.keys(payload).length === 0) {
                addToast("No changes made", "info");
                return;
            }

            const response = await updateEnrollment(initialData.id, payload);
            if (response.success) {
                addToast(response.message, "success");
                onSuccess?.(response.data, "update");
                onClose?.();
            } else {
                addToast(response.message, "error");
            }

        } else {
            const payload = {
                userId: formData.userId,
                courseId: formData.courseId,
                status: formData.status || "in-progress",
                expireAt: formData.expireAt || null,
            };

            const response = await createNewEnrollment(payload);
            if (response.success) {
                addToast(response.message, "success");
                onSuccess?.(response.data, "create");
                onClose?.();
            } else {
                addToast(response.message, "error");
            }
        }
    };

    // delete handler
    const handleActionDelete = async (id) => {
        const response = await deleteEnrollment(id);
        if (response?.success) {
            addToast(response.message, "success");
            onSuccess?.(null, "delete");
            onClose?.();
        } else {
            addToast(response.message || "Delete failed", "error");
        }
    };

    // delete mode
    if (mode === "delete") {
        return (
            <DeleteConfirmContent
                confirmText={initialData?.name || ""}
                entityName="enrollment"
                message={
                    <span>
                        You are about to remove{" "}
                        <strong className="font-bold text-main">{initialData?.name}</strong> from{" "}
                        <strong className="font-bold">{initialData?.courseName}</strong>.
                        Their progress, submitted assignments, and grades will be permanently erased.
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
            {!isEdit &&
                <>
                    <SearchSelect
                        label="User"
                        disabled={isEdit}
                        value={userSearch}
                        onChange={(val) => {
                            setUserSearch(val);
                            if (!val) handleChange("userId", "");
                        }}
                        results={userResult}
                        loading={searchingUser}
                        getLabel={(item) => item.username}
                        getSubLabel={(item) => item.email}
                        onSelect={(item) => {
                            handleChange("userId", item.id);
                            setUserSearch(item.username);
                        }}
                        inputWarning={warning.userId}
                    />


                    <SearchSelect
                        label="Course"
                        disabled={isEdit}
                        value={courseSearch}
                        onChange={(val) => {
                            setCourseSearch(val);
                            if (!val) handleChange("courseId", "");
                        }}
                        loading={courseLoading}
                        results={courseResults}
                        getLabel={(item) => item.title}
                        onSelect={(item) => {
                            handleChange("courseId", item.id);
                            setCourseSearch(item.title);
                        }}
                        inputWarning={warning.courseId}
                    />

                </>
            }

            {isEdit && (
                <Select
                    inputLabel="Status"
                    value={formData.status}
                    options={[
                        { label: "Active", value: "active" },
                        { label: "In Progress", value: "in-progress" },
                        { label: "Completed", value: "completed" },
                        { label: "Cancelled", value: "cancelled" },
                    ]}
                    onChange={(val) => handleChange("status", val)}
                />
            )}

            <Input
                label="Expiry Date"
                type="date"
                value={formData.expireAt}
                onChange={(e) => handleChange("expireAt", e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
            />

            <div className="flex w-full gap-3 pt-4">
                <Button
                    type="button"
                    buttonName="Cancel"
                    className="px-4 py-2 rounded-lg w-full border border-default"
                    bgClass="bg-transparent"
                    textClass="text-main"
                    onClick={onClose}
                />
                <Button
                    type="submit"
                    disabled={creating || updating}
                    buttonName={
                        creating || updating
                            ? "Processing..."
                            : isEdit ? "Save Changes" : "Add Enrollment"
                    }
                    className="px-4 py-2 rounded-lg w-full"
                />
            </div>
        </form>
    );
}

export default EnrollmentForm;