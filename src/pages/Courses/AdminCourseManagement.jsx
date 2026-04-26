import React, { useState, useEffect } from 'react'

import { useDebounce } from '@/hooks/useDebounce';
import { useCourseData } from './hooks/useCoursesData';
import { useBreadcrumbs } from "@/context/BreadcrumbContext";

import { TableToolbar, DataTable, } from '@/components/Table'
import { Select, Avatar, StatusPill, Button, Modal, DeleteConfirmContent } from "@/components/ui"

import { COURSE_COLUMNS_BASE } from '@/config/tablesColumnConfig';
import { COURSE_SORT_OPTION, EROLLMENT_STATUS_OPTIONS, ROLE_OPTIONS } from '@/config/adminFiltersSelectOptions'

import CourseActionHandler from './CourseActionHandler';

import formatDateTime from '@/utils/formatDateTime'
import { useNavigate } from 'react-router-dom';



function AdminCourseManagement() {

    const INITIAL_FILTERS = {
        search: "",
        sort: null,
    };

    const { resetBreadcrumbs } = useBreadcrumbs();

    const navigate = useNavigate();

    const { courses, setCourses, loading, error, total, refreshCourses } = useCourseData();

    // useSates
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [actionType, setActionType] = useState(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [selectedRows, setSelectedRows] = useState([]);

    // fileters state
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const isSearchActive = filters.search.trim().length > 0;

    // Passing filters.search value to treger debounce for evety 500ms
    const debouncedSearch = useDebounce(filters.search, 500);


    // Breadcrumb setup - set the course breadcrumb on mount and clear it on unmount
    useEffect(() => {
        resetBreadcrumbs();
    }, [resetBreadcrumbs]);


    // ------------Table Columns------------
    // Inside your Enrollments component:
    const columns = COURSE_COLUMNS_BASE.map((col) => {
        switch (col.key) {
            case "title":
                return {
                    ...col,
                    render: (row) => (
                        <div className="hover:text-primary hover:cursor-pointer transition-colors" onClick={() => handleOpenOverview(row.id)}>
                            {row.title}
                        </div>
                    ),
                };

            case "shortDescription":
                return {
                    ...col,
                    render: (row) => (
                        <p title={row.shortDescription} className={`h-10 overflow-hidden leading-5 line-clamp-2 ${!row.shortDescription ? "text-muted italic" : ""}`}>
                            {row.shortDescription || "No description provided"}
                        </p>
                    ),
                };

            case "trainer":
                return { ...col, render: (row) => <span className="text-main">{row.trainerName}</span> };

            case "created_at":
                return { ...col, render: (row) => <span className="text-caption">{formatDateTime(row.createdAt)}</span> };

            case "actions":
                return {
                    ...col,
                    render: (row) => {
                        const actions = ["iconamoon:eye-light", "mingcute:pencil-line", "mdi:delete-outline"]

                        return (
                            <div className="flex items-center justify-center gap-3">
                                {actions.map((icon, index) => (
                                    <Button key={index} frontIconName={icon} frontIconHeight="18" frontIconWidth="18" bgClass="" textClass=""
                                        onClick={() => {
                                            if (icon === "iconamoon:eye-light") handleOpenOverview(row.id)
                                            if (icon === "mingcute:pencil-line") handleOpenEdit(row);
                                            if (icon === "mdi:delete-outline") handleOpenDelete(row);
                                        }}
                                    />
                                ))}
                            </div>
                        )
                    }
                };

            default:
                return col;
        }
    });

    // Always add your dynamic Checkbox column at the start
    const finalColumns = [
        {
            key: "check_box",
            label: (
                <div className="flex justify-center">
                    <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className='accent-primary dark:accent-transparent'
                    />
                </div>
            ),
            align: "left",
            width: "5%",
            render: (row) => (
                <div className="flex justify-center">
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        className='accent-primary dark:accent-transparent'
                    />
                </div>
            )
        },
        ...columns,
    ];

    // --------------Table end ----------------


    // fetch users data useEffect
    useEffect(() => {

        const sortMapping = {
            create_asc: { sortByCreatedAt: "asc" },
            create_desc: { sortByCreatedAt: "desc" },
            course_asc: { sortByCourseName: "asc" },
            course_desc: { sortByCourseName: "desc" },
            trainees_asc: { sortByNoOfTrainees: "asc" },
            trainees_desc: { sortByNoOfTrainees: "desc" },
        };

        // Destructure for cleaner code inside the call
        const { sort } = filters;

        const params = {
            page: page,
            limit: pageSize,
            courseNameOrTrainerName: debouncedSearch || undefined,
            ...(sortMapping[sort] || {}),
        }
        Object.keys(params).forEach(key =>
            (params[key] === undefined || params[key] === null) && delete params[key]
        );

        refreshCourses(params);

        // Dependency array now watches the 'filters' object or specific keys
    }, [page, pageSize, debouncedSearch, filters.sort, refreshCourses]);



    // ----- handle fuctions -------

    // on success of update create
    const handleOnSuccess = (data, type) => {
        if (type === "delete") {
            setCourses((prev) =>
                prev.filter((course) => course.id !== data.id)
            );
        } else {
            refreshCourses(); // create / update
        }
    };


    // Handle Actions delete, edit, view



    // Create
    const handleOpenCreate = () => {
        setSelectedCourse(null);
        setActionType("create");
        setOpen(true);
    };

    // View (navigate to course OverView)
    const handleOpenOverview = (courseId) => {
        navigate(`/course/${courseId}/overview`)
    }

    // Update
    const handleOpenEdit = (course) => {
        setSelectedCourse(course);
        setActionType("edit");
        setOpen(true);
    };

    // Delete
    const handleOpenDelete = (course) => {
        setSelectedCourse(course);
        setActionType("delete");
        setOpen(true);
    };

    // Close
    const handleClose = () => {
        setOpen(false);
        setSelectedCourse(null);
        setActionType(null);
    };


    // Clear Filters
    const clearFilters = () => {
        setFilters(INITIAL_FILTERS);
        setPage(1);
    };


    // Select single Row function
    const handleSelectRow = (id, checked) => {
        if (checked) {
            setSelectedRows((prev) => [...prev, id]);
        } else {
            setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
        }
    };

    // Select All rows 
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedRows(courses.map((row) => row.id));
        } else {
            setSelectedRows([]);
        }
    };

    // A single helper function to update any field when filters changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setPage(1);
    };


    // Export Fuction
    const handleExport = () => {
        alert("export clciked")
    }



    return (
        <div className="w-full p-4 bg-transparent text-main border-b border-gray-200">
            <TableToolbar
                headerLabel="Course Management"
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                search={filters.search}
                searchPlaceholder="Search by Course name or Trainer names"
                setSearch={(val) => {
                    handleFilterChange('search', val);
                    setPage(1);
                }}
                onAdd={() => handleOpenCreate()}
                onExport={() => handleExport()}
                addLabel="Add New Course"
            // BulK Action ui can add here
            // eg : bulkActions={<div> Actions ui delete, etc,..., </div>}
            >
                <Select
                    label="Sort by:"
                    value={filters.sort}
                    onChange={(value) => handleFilterChange('sort', value)}
                    options={COURSE_SORT_OPTION}
                    disabled={isSearchActive}
                />

            </TableToolbar>


            {/* Course Table */}
            <DataTable
                loading={loading}
                selectedRows={selectedRows}
                columns={finalColumns}
                data={courses}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                clearFilters={clearFilters}
            // renderMobileCard={(row, key) => (
            //     <CourseCard
            //         key={key}
            //         row={row}
            //         columns={coursesManagementColumns}
            //         loading={loading}
            //     />
            // )}
            />


            {open && (
                <Modal
                    isOpen={open}
                    onClose={handleClose}
                    title={
                        actionType === "delete" ? "Are you absolutely sure?" :
                            actionType === "edit" ? "Update Course" : "Add New Course"
                    }
                >
                    <CourseActionHandler
                        mode={actionType}
                        CourseData={selectedCourse}
                        onClose={handleClose}
                        onSuccess={handleOnSuccess}
                    />
                </Modal>
            )}

        </div>
    )
}

export default AdminCourseManagement
