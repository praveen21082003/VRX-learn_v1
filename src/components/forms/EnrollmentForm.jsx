import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'

import useDebouncedSearch from './hooks/useDebouncedSearch'
import { useEnrollmentActions } from './hooks/useEnrollmentActions'
import { searchUser, searchCourse } from '../../services/AdminSearch.service'
import { useModule } from './hooks/useModules'

import { useToast } from '@/context/ToastProvider'
import formatDateTime from '@utils/formatDateTime.js'

import { SearchSelect, Input, Button, Select, DeleteConfirmContent, Icon, ToggleSwitch } from '@/components/ui'
import { Tabs } from '@/components/tabs'

// moved outside — static data, no reason to recreate on every render

const TABS = [
    { label: "Enrollment Management", value: "enrollment_management" },
    { label: "Access Management", value: "access_management" },
];

const STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

function EnrollmentForm({ initialData, onClose, onSuccess, mode, isEdit }) {
    const { addToast } = useToast();
    const {
        enrollment,

        fetchEnrollment,
        createNewEnrollment,
        updateEnrollment,
        deleteEnrollment,
        restrictModules,

        fetchingEnrollment,
        creating,
        updating,
        deleting,
        isLoading,

        error
    } = useEnrollmentActions();
    const { modules, fetchModules, loading: modulesLoading, error: modulesError } = useModule();

    const originalRestrictedModules = useRef([]);

    const [formData, setFormData] = useState({
        userId: initialData?.userId || "",
        courseId: initialData?.courseId || "",
        status: initialData?.status || "in-progress",
        expireAt: initialData?.expireAt ? initialData.expireAt.split('T')[0] : "",
    });

    const [restrictedModules, setRestrictedModules] = useState([]);
    const [warning, setWarning] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("enrollment_management");
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        if (selectedCourseId) {
            fetchModules(selectedCourseId);
        }
    }, [selectedCourseId, fetchModules]);

    useEffect(() => {
        if (isEdit && initialData) {
            setUserSearch(initialData.name);
            setCourseSearch(initialData.courseName);
        }
    }, [isEdit, initialData]);

    // to fetch the enrollment with enrollment id
    useEffect(() => {
        if (
            isEdit &&
            initialData?.id &&
            enrollment?.id !== initialData.id
        ) {
            fetchEnrollment(initialData.id);
        }
    }, [
        isEdit,
        initialData?.id,
        enrollment?.id,
        fetchEnrollment,
    ]);

    useEffect(() => {
        if (!isEdit || !enrollment?.modules) return;

        const restrictedIds = enrollment.modules
            .filter(module => module.restricted)
            .map(module => module.id);

        setRestrictedModules(restrictedIds);
        originalRestrictedModules.current = restrictedIds;
    }, [isEdit, enrollment]);


    const memoizedUserParams = useMemo(() => ({ role: ["trainee", "trainer"] }), []);

    const handleSearchUser = useCallback(async ({ query, role }) => {
        return await searchUser({ username_or_email: query, role });
    }, []);

    const handleSearchCourse = useCallback(async ({ query }) => {
        return await searchCourse({ query });
    }, []);

    const { search: userSearch, setSearch: setUserSearch, results: userResult, searching: searchingUser } = useDebouncedSearch({
        searchFn: handleSearchUser,
        extraParams: memoizedUserParams,
        skip: isEdit,
    });

    const { search: courseSearch, setSearch: setCourseSearch, results: courseResults, searching: courseLoading } = useDebouncedSearch({
        searchFn: handleSearchCourse,
        delay: 500,
        skip: isEdit,
    });

    const handleChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setWarning(prev => ({ ...prev, [field]: null }));
    }, []);


    // toggle switch handler stores restricted modules to state
    const handleModuleToggle = useCallback((moduleId) => {
        setRestrictedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId) // enable again
                : [...prev, moduleId] // restrict
        );
    }, []);


    const MODULE_ACCESS_DATA = isEdit
        ? enrollment?.modules || []
        : modules || [];



    // form validation function 
    const validate = useCallback(() => {
        const errors = {};
        if (!isEdit) {
            if (!formData.userId) errors.userId = "Please select a user from dropdown";
            if (!formData.courseId) errors.courseId = "Please select a course from dropdown";
        }
        return errors;
    }, [isEdit, formData.userId, formData.courseId]);

    const buildUpdatePayload = useCallback(() => {
        const payload = {};
        if (formData.status !== initialData?.status) payload.status = formData.status;
        const originalExpiry = initialData?.expireAt ? initialData.expireAt.split('T')[0] : "";
        if (formData.expireAt !== originalExpiry) payload.expireAt = formData.expireAt || null;
        return payload;
    }, [formData.status, formData.expireAt, initialData]);


    // handle submit function to submit the enrollment form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading || updating || creating) return;

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setWarning(errors);
            return;
        }


        if (isEdit) {
            if (activeTab === "enrollment_management") {
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
            }
            else {
                // check if modules actually changed
                const hasChanged =
                    restrictedModules.length !== originalRestrictedModules.current.length ||
                    restrictedModules.some(id => !originalRestrictedModules.current.includes(id));

                if (!hasChanged) {
                    addToast("No changes made", "info");
                    return;
                }

                const payload = { moduleIds: restrictedModules };
                console.log(initialData.id, payload);
                const response = await restrictModules(initialData.id, payload);
                if (response.success) {
                    addToast(response.message, "success");
                    onClose?.();
                } else {
                    addToast(response.message, "error");
                }
            }

        } else {
            const payload = {
                userId: formData.userId,
                courseId: formData.courseId,
                status: formData.status || "in-progress",
                expireAt: formData.expireAt || null,
                restrictedModuleIds: restrictedModules,
            };
            const response = await createNewEnrollment(payload);
            if (response.success) {
                addToast(response.message, "success");
                onSuccess?.(response.data, "create");
                onClose?.();
            } else {
                if (response.status === 409) {
                    setWarning(prev => ({ ...prev, userId: "This user is already enrolled in the course." }));
                    return;
                }
                addToast(response.message, "error");
            }
        }
    };

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

    // extracted — used in both create and edit tabs
    const UserCourseSearchFields = (
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
                placeholder="Search by username or email"
                onSelect={(item) => {
                    handleChange("userId", item.id);
                    setUserSearch(item.username);
                }}
                inputWarning={warning.userId}
                paddingClass="px-3 py-2.5"
                disabled={isEdit}
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
                placeholder="Search by course title"
                onSelect={(item) => {
                    handleChange("courseId", item.id);
                    setCourseSearch(item.title);
                    setSelectedCourseId(item.id);
                }}
                inputWarning={warning.courseId}
                paddingClass="px-3 py-2.5"
            />
        </>
    );

    // extracted — used in both create accordion and edit access_management tab
    const ModuleAccessList = (
        <div>
            {!isEdit && !formData.courseId ? (
                <div className="text-center text-caption text-muted py-6">
                    Select a course first to manage module access.
                </div>
            ) : modulesLoading || fetchingEnrollment ? (
                <div className="flex items-center justify-center gap-2 py-6 text-muted">
                    <Icon name="line-md:loading-twotone-loop" height="20" width="20" />
                    <span className="text-caption">Loading modules...</span>
                </div>
            ) : MODULE_ACCESS_DATA.length === 0 ? (
                <div className="text-center text-caption text-muted py-6">
                    This course has no modules yet.
                </div>
            ) : (
                <>
                    <header className="text-end text-small py-3">{MODULE_ACCESS_DATA.length - restrictedModules.length} Modules Enabled</header>
                    <ul>
                        {MODULE_ACCESS_DATA?.map(module => (
                            <li key={module.id} className="flex items-center justify-between py-4">
                                <span className="text-body w-[70%] truncate">{module.title}</span>
                                <ToggleSwitch
                                    checked={!restrictedModules.includes(module.id)}
                                    onChange={() => handleModuleToggle(module.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            )}

        </div>
    );

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
        <form onSubmit={handleSubmit}>
            {isEdit ? (
                <div>
                    <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} textClass="text-h5" />

                    {activeTab === "enrollment_management" && (
                        <div className="space-y-4 py-4">
                            {UserCourseSearchFields}
                            <div className="grid grid-cols-2 gap-2">
                                <Select
                                    inputLabel="Status"
                                    value={formData.status}
                                    options={STATUS_OPTIONS}
                                    onChange={(val) => handleChange("status", val)}
                                    borderClass="border-input-border"
                                    paddingClass="px-3 py-2.5"
                                />
                                <Input
                                    label="Expiry Date"
                                    type="date"
                                    value={formData.expireAt}
                                    onChange={(e) => handleChange("expireAt", e.target.value)}
                                    min={new Date().toISOString().slice(0, 10)}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "access_management" && (
                        <div className="overflow-hidden transition-all duration-300 opacity-100 mt-3">
                            {ModuleAccessList}
                        </div>
                    )}

                    <div className="flex justify-between border-t border-default">
                        <span className="flex items-center gap-2 text-caption text-muted mt-3">
                            <Icon name="pepicons-pop:rewind-time" size="16" />

                            {fetchingEnrollment ? (
                                <div className="h-4 w-72 rounded bg-gray-200 animate-pulse" />
                            ) : (
                                <p className='max-w-90'>
                                    Last updated by{" "}
                                    <span className="font-medium">
                                        {enrollment?.updatedBy || "-"}
                                    </span>{" "}
                                    on{" "}
                                    {enrollment?.updatedAt
                                        ? formatDateTime(enrollment.updatedAt)
                                        : "-"}
                                </p>
                            )}
                        </span>
                        <div className="flex gap-2 items-center py-3">
                            <Button
                                type="button"
                                buttonName="Cancel"
                                className="px-4 py-2 rounded-lg"
                                bgClass=""
                                textClass=""
                                variant="outline"
                                onClick={onClose}
                            />
                            <Button
                                type="submit"
                                disabled={creating || updating || isLoading}
                                buttonName={creating || updating || isLoading ? "Processing..." : isEdit ? "Save Changes" : "Add Enrollment"}
                                className="px-4 py-2 rounded-lg shrink-0"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {UserCourseSearchFields}
                    <Input
                        label="Expiry Date"
                        type="date"
                        value={formData.expireAt}
                        onChange={(e) => handleChange("expireAt", e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                    />

                    <div
                        className="flex justify-between cursor-pointer"
                        onClick={() => setIsOpen(prev => !prev)}
                    >
                        <span className="flex items-center gap-2">
                            <h4 className="text-h5">Advanced: Customize Module Access</h4>
                            <span className="text-caption">(Recommended)</span>
                        </span>
                        <Icon
                            name="iconamoon:arrow-down-2"
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                        {ModuleAccessList}
                    </div>
                    <div className="flex w-full gap-3">
                        <Button
                            type="button"
                            buttonName="Cancel"
                            className="px-4 py-2 rounded-lg w-full"
                            bgClass=""
                            textClass=""
                            variant="outline"
                            onClick={onClose}
                        />
                        <Button
                            type="submit"
                            disabled={creating || updating || isLoading}
                            buttonName={creating || updating ? "Processing..." : "Add Enrollment"}
                            className="px-4 py-2 rounded-lg w-full"
                        />
                    </div>
                </div>
            )}


        </form>
    );
}

export default EnrollmentForm;