import React, { useState, useEffect } from 'react'

import { useEnrollmentsData } from './hooks/useEnrollmentsData'
import { useDebounce } from '@/hooks/useDebounce';

import { TableToolbar, DataTable, } from '@/components/Table'
import { Select, Avatar, StatusPill, Button } from "@/components/ui"

import { ENROLLMENT_COLUMNS_BASE } from '@/config/tablesColumnConfig';
import { EROLLMENT_SORT_OPTIONS, EROLLMENT_STATUS_OPTIONS, ROLE_OPTIONS } from '@/config/adminFiltersSelectOptions'


import formatDateTime from '@/utils/formatDateTime'

function EnrollmentsManagement() {

    const INITIAL_FILTERS = {
        search: "",
        role: null,
        sort: null,
        status: null
    };

    const { enrollments, setEnrollments, loading, error, total, refreshEnrollments } = useEnrollmentsData();

    // useSates
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [selectedRows, setSelectedRows] = useState([]);

    // fileters state
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const isSearchActive = filters.search.trim().length > 0;

    // Passing filters.search value to treger debounce for evety 500ms
    const debouncedSearch = useDebounce(filters.search, 500);



    // ------------Table Columns------------
    // Inside your Enrollments component:
    const columns = ENROLLMENT_COLUMNS_BASE.map((col) => {
        switch (col.key) {
            case "profile":
                return { ...col, render: (row) => <Avatar name={row.name} /> };

            case "name":
                return { ...col, render: (row) => <span className="text-h5">{row.name}</span> };

            case "role":
            case "status":
                return { ...col, render: (row) => <StatusPill status={row[col.key]} /> };

            case "courseName":
                return { ...col, render: (row) => <span>{row.courseName}</span> };

            case "enrolled_at":
                return { ...col, render: (row) => <span className="text-caption text-muted">{formatDateTime(row.enrollmentDate)}</span> };

            case "date":
                return { ...col, render: (row) => <span className="text-caption text-muted">{formatDateTime(row.expireAt)}</span> };

            case "actions":
                return {
                    ...col,
                    render: (row) => {
                        const actions = ["mingcute:pencil-line", "mdi:delete-outline"];
                        return (
                            <div className="flex items-center justify-center gap-3">
                                {actions.map((icon, index) => (
                                    <Button
                                        key={index}
                                        frontIconName={icon}
                                        frontIconHeight="18" frontIconWidth="18" bgClass="" textClass=""
                                        onClick={() => {
                                            if (icon === "mingcute:pencil-line") handleOpenEdit(row);
                                            if (icon === "mdi:delete-outline") handleOpenDelete(row);
                                        }}

                                    />
                                ))}
                            </div>
                        );
                    }
                };

            default:
                return col;
        }
    });

    // Add the checkbox column to the front
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
    // --------------Table colums end-----------------




    // fetch users data useEffect
    useEffect(() => {

        const sortMapping = {
            create_asc: { sortByEnrollmentDate: "asc" },
            create_desc: { sortByEnrollmentDate: "desc" },
            course_asc: { sortByCourseName: "asc" },
            course_desc: { sortByCourseName: "desc" },
        };

        // Destructure for cleaner code inside the call
        const { role, status, sort } = filters;

        const params = {
            page: page,
            limit: pageSize,
            nameOrEmail: debouncedSearch || undefined,
            role: role || undefined,
            status: status || undefined,
            ...(sortMapping[sort] || {}),
        }
        Object.keys(params).forEach(key =>
            (params[key] === undefined || params[key] === null) && delete params[key]
        );

        refreshEnrollments(params);

        // Dependency array now watches the 'filters' object or specific keys
    }, [page, pageSize, debouncedSearch, filters.role, filters.status, filters.sort, refreshEnrollments]);



    // ----- handle fuctions -------


    // Clear Filters
    const clearFilters = () => {
        setFilters(INITIAL_FILTERS);
        // setPage(1);
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
            setSelectedRows(enrollments.map((row) => row.id));
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
    };


    // Export Fuction
    const handleExport = () => {
        alert("export clciked")
    }


    return (
        <div className="w-full p-4 bg-transparent text-main border-b border-gray-200">
            <TableToolbar
                headerLabel="Enrollment Management"
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                search={filters.search}
                setSearch={(val) => handleFilterChange('search', val)}
                onAdd={() => setOpen(true)}
                onExport={() => handleExport()}
                addLabel="Add New Enrollment"
            // BulK Action ui can add here
            // eg : bulkActions={<div> Actions ui delete, etc,..., </div>}
            >
                <Select
                    label="Sort by:"
                    value={filters.sort}
                    onChange={(value) => handleFilterChange('sort', value)}
                    options={EROLLMENT_SORT_OPTIONS}
                />
                <Select
                    label="Role:"
                    value={filters.role}
                    onChange={(value) => handleFilterChange('role', value)}
                    options={ROLE_OPTIONS}
                />

                <Select
                    label="Status:"
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    options={EROLLMENT_STATUS_OPTIONS}
                />

            </TableToolbar>

            <DataTable
                loading={loading}
                selectedRows={selectedRows}
                columns={finalColumns}
                data={enrollments}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                clearFilters={clearFilters}
            // renderMobileCard={(row) => (
            //     <EnrollmentCard
            //         row={row}
            //         columns={enrollmentsManagementColumns}
            //     />
            // )}
            />

        </div>
    )
}

export default EnrollmentsManagement
