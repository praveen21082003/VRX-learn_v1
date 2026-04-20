import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { SearchSelect, Input, Button, Select } from '@/components/ui'

import useDebouncedSearch from './hooks/useDebouncedSearch';

import { searchUser } from '../../services/AdminSearch.service';
import { searchCourse } from '../../services/AdminSearch.service';

function EnrollmentForm({ initialData, isCreating, isUpdating, onClose, isEdit }) {

    // inside EnrollmentForm
    const [formData, setFormData] = useState({
        userId: initialData?.userId || "",
        courseId: initialData?.courseId || "",
        status: initialData?.status || "in-progress",
        // Format date string to YYYY-MM-DD for the input[type="date"]
        expireAt: initialData?.expireAt ? initialData.expireAt.split('T')[0] : "",
    });
    console.log(formData)

    // Update search strings for edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            setUserSearch(initialData.name); // Using the name from the table row
            setCourseSearch(initialData.courseName);
        }
    }, [isEdit, initialData]);


    // ----------search user and Course-----------

    const memoizedParams = useMemo(() => ({
        role: ["trainee", "trainer"]
    }), []);


    const handleSearchUser = useCallback(async ({ query, role }) => {
        return await searchUser({
            username_or_email: query,
            role: role
        });
    }, []);

    const handleSearchCourse = useCallback(async ({ query }) => {
        return await searchCourse({ query });
    }, []);


    const {
        search: userSearch,
        setSearch: setUserSearch,
        results: userResult,
        searching: searchingUser
    } = useDebouncedSearch({
        searchFn: handleSearchUser,
        extraParams: memoizedParams
    });

    const {
        search: courseSearch,
        setSearch: setCourseSearch,
        results: courseResults,
        searching: courseLoading
    } = useDebouncedSearch({
        searchFn: handleSearchCourse,
        delay: 500
    });



    // ---- Handle Change Fuction

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        })
        )
    }




    return (
        <form className="space-y-4">
            <SearchSelect
                label="User"
                disabled={isEdit}
                value={userSearch}
                onChange={setUserSearch}
                results={userResult}
                loading={searchingUser}
                getLabel={(item) => item.username}
                getSubLabel={(item) => item.email}
                onSelect={(item) => {
                    handleChange("userId", item.id);
                    setUserSearch(item.username);
                }}
            // inputWarning={warnings.userId}
            />

            <SearchSelect
                label="Course"
                disabled={isEdit}
                value={courseSearch}
                onChange={setCourseSearch}
                loading={courseLoading}
                results={courseResults}
                renderItem={(item) => item.title}
                onSelect={(item) => {
                    handleChange("courseId", item.id);
                    setCourseSearch(item.title);
                }}
            // inputWarning={warnings.courseId}
            />

            {isEdit && (
                <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    options={[
                        { label: "Active", value: "active" },
                        { label: "In Progress", value: "in-progress" },
                        { label: "Completed", value: "completed" },
                        { label: "Cancelled", value: "cancelled" }
                    ]}
                    onChange={(val) => handleChange("status", val)}
                />
            )}



            <Input
                label="Expiry Date"
                name="expireAt"
                type="date"
                value={formData.expireAt}
                onChange={(e) => handleChange("expireAt", e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full border-default"
            // inputWarning={warnings.expireAt}
            />

            <div className="flex w-full gap-3 pt-4">
                <Button
                    buttonName="Cancel"
                    className="px-4 py-2 rounded-lg w-full border border-default"
                    bgClass="bg-transparent"
                    textClass="text-main"
                    onClick={onClose}
                />

                <Button
                    disabled={isCreating || isUpdating}
                    buttonName={isCreating ? "Processing..." : isEdit ? isUpdating ? "Updating..." : "Save Changes" : "Add Enrollment"}
                    className="px-4 py-2 rounded-lg w-full"
                    bgClass="bg-primary"
                    textClass="text-white"
                // onClick={handleSubmit}
                />
            </div>


        </form>
    )
}

export default EnrollmentForm
