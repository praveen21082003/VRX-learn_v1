import React, { useState } from 'react'
import { Input, Icon, Select, Avatar, StatusPill, Button } from '@/components/ui';
import { DataTable, TableToolbar } from '@/components/Table'

import SubmissionTableMobileCard from './SubmissionTableMobileCard';

import formatDateTime from '@/utils/formatDateTime'
import { SUBMISSION_COLUMNS_BASE } from '@/config/tablesColumnConfig';

function SubmissionsTab({ setActiveTab, submissions, setActiveAssignmentId, loading, setParms, parms }) {
    const page = parms.page;
    const pageSize = parms.limit;

    // states
    const [filtersOpen, setFiltersOpen] = useState(false);

    console.log(parms);


    const handleFilterChange = (field, value) => {
        setParms((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePageChange = (newPage) => {
        setParms((prev) => ({
            ...prev,
            page: newPage
        }));
    };

    const handlePageSizeChange = (newSize) => {
        setParms((prev) => ({
            ...prev,
            limit: newSize,
            page: 1
        }));
    };


    const columns = SUBMISSION_COLUMNS_BASE.map((col) => {
        switch (col.key) {
            case "student": return {
                ...col, render: (row) =>
                    <div className="flex items-center text-main gap-2">
                        <Avatar name={row.username} />
                        <div>
                            <p className='text-body'>{row.username}</p>
                            <p className="text-caption">{row.email}</p>
                        </div>
                    </div>
            };
            case "submittedAt": return { ...col, render: (row) => <span className='text-caption'>{formatDateTime(row.submittedAt)}</span> };
            case "status": return { ...col, render: (row) => <StatusPill status={row.status} /> };
            case "score": return {
                ...col, render: (row) =>
                    <div className="flex text-body items-center gap-1">
                        <div className="border border-default w-12 h-7 flex items-center justify-center">
                            {row.status === "graded" ? row.score : ""}
                        </div>
                        <span>{row.maxScore}</span>
                    </div>
            };
            case "actions": return {
                ...col, render: (row) =>
                    <div className='flex justify-center items-center'>
                        <Button frontIconName="iconamoon:eye-light" frontIconHeight="18" frontIconWidth="18" bgClass="" textClass="" onClick={() => { setActiveTab("view_submission"); setActiveAssignmentId(row.id) }} />
                    </div>
            };
            default: return col;
        }
    });




    return (
        <div className='space-y-2'>
            <div className='hidden lg:flex flex-wrap justify-between gap-3 items-end w-full'>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 flex-1 min-w-0'>
                    <Input
                        label="From Date"
                        value={parms.fromDate || ""}
                        onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                        border="border border-default"
                        paddingClass="py-2 px-2"
                        placeholder="DD/MM/YYYY"
                        type="date"
                    />

                    <Input
                        label="To Date"
                        value={parms.toDate}
                        onChange={(e) => handleFilterChange("toDate", e.target.value)}
                        border="border-default"
                        paddingClass="py-2 px-2"
                        placeholder="DD/MM/YYYY"
                        type="date"
                    />

                    <div className="col-span-1 md:col-span-1">
                        <Select
                            inputLabel="Status"
                            label="Status:"
                            value={parms.status}
                            onChange={(value) => handleFilterChange("status", value)}
                            options={[
                                { label: "All", value: null },
                                { label: "Submitted", value: "submitted" },
                                { label: "Graded", value: "graded" },
                                { label: "Done Late", value: "done-late" },
                            ]}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-1">
                        <Select
                            inputLabel="Sort by"
                            label="Sort by Grade:"
                            value={parms.sortByGrade}
                            onChange={(value) => handleFilterChange("sortByGrade", value)}
                            options={[
                                { label: "None", value: null },
                                { label: "Ascending", value: "asc" },
                                { label: "Descending", value: "desc" },
                            ]}
                        />
                    </div>
                </div>
                <div className='hidden md:block shrink-0'>
                    <Button buttonName="Export as CSV" frontIconName="material-symbols:download" frontIconHeght="24" frontIconWidth="24" className="p-1 px-2 rounded font-semibold text-md" bgClass="" textClass="text-primary dark:text-background" />
                </div>
            </div>


            {/* ── Mobile filters — collapsible ── */}
            <div className='lg:hidden border border-default rounded-lg'>
                {/* header — always visible */}
                <button
                    className='w-full flex justify-between items-center px-4 py-3 bg-muted'
                    onClick={() => setFiltersOpen(prev => !prev)}
                >
                    <span className='text-h5 font-medium'>Filters</span>
                    <Icon
                        name="iconamoon:arrow-up-2"
                        height="20" width="20"
                        className={`transition-transform duration-300 ${filtersOpen ? "rotate-0" : "rotate-180"}`}
                    />
                </button>

                {/* collapsible body */}
                {filtersOpen && (
                    <div className='p-3 space-y-3 border-t border-default'>
                        <div className='grid grid-cols-2 gap-2'>
                            <Input
                                label="From Date"
                                value={parms.fromDate || ""}
                                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                                border="border border-default"
                                paddingClass="py-2 px-2"
                                type="date"
                            />
                            <Input
                                label="To Date"
                                value={parms.toDate}
                                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                                border="border-default"
                                paddingClass="py-2 px-2"
                                type="date"
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            <Select
                                label="Status:"
                                value={parms.status}
                                onChange={(value) => handleFilterChange("status", value)}
                                options={[
                                    { label: "All", value: null },
                                    { label: "Submitted", value: "submitted" },
                                    { label: "Graded", value: "graded" },
                                    { label: "Done Late", value: "done-late" },
                                ]}
                            />
                            <Select
                                label="Sort by Grade:"
                                value={parms.sortByGrade}
                                onChange={(value) => handleFilterChange("sortByGrade", value)}
                                options={[
                                    { label: "None", value: null },
                                    { label: "Ascending", value: "asc" },
                                    { label: "Descending", value: "desc" },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </div>



            <DataTable
                columns={columns}
                data={submissions}
                page={page}
                setPage={handlePageChange}
                pageSize={pageSize}
                setPageSize={handlePageSizeChange}
                total={submissions?.totalItems || 0}
                loading={loading}
                renderMobileCard={(row) => (
                    <SubmissionTableMobileCard
                        row={row}
                        onView={() => {
                            setActiveTab("view_submission");
                            setActiveAssignmentId(row.id);
                        }}
                    />
                )}
            />
        </div>
    );
}

export default SubmissionsTab
