import React from 'react'
import { Input, Select, Avatar, StatusPill, Button } from '@/components/ui';
import { DataTable, TableToolbar } from '@/components/Table'

import formatDateTime from '@/utils/formatDateTime'

function SubmissionsTab({ setActiveTab, submissions, setActiveAssignmentId, loading, setParms, parms }) {
    const page = parms.page;
    const pageSize = parms.limit;

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


    const columns = [
        {
            key: "student",
            label: "Student Name",
            width: "25%",
            align: "left",
            render: (row) => (
                <div className="flex items-center text-main gap-2">
                    <Avatar name={row.username} />
                    <div>
                        <p className='text-body'>{row.username}</p>
                        <p className="text-caption">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: "attempt",
            label: "Attempt",
            width: "10%",
        },
        {
            key: "submittedAt",
            label: "Submission Date",
            width: "20%",
            render: (row) => (
                <span className='text-caption'>{formatDateTime(row.submittedAt)}</span>
            )
        },
        {
            key: "status",
            label: "Status",
            width: "15%",
            render: (row) => (
                <StatusPill status={row.status} />
            ),
        },
        {
            key: "score",
            label: "Grade",
            width: "10%",
            render: (row) => (
                <div className="flex text-body items-center gap-1">
                    <div className="border border-default w-12 h-7 flex items-center justify-center">
                        {row.status === "graded" ? row.score : ""}
                    </div>
                    <span>{row.maxScore}</span>
                </div>
            )
        },
        {
            key: "actions",
            label: "Actions",
            width: "10%",
            render: (row) => (
                <div className='flex justify-center items-center'>
                    <Button frontIconName="iconamoon:eye-light" frontIconHeight="18" frontIconWidth="18" bgClass="" textClass="" onClick={() => { setActiveTab("view_submission"); setActiveAssignmentId(row.id) }} />
                </div>
            )
        },
    ];

    return (
        <div className='space-y-2'>
            <div className='flex justify-between gap-5 items-end w-full'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
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
                <div className='flex w-40'>
                    <Button buttonName="Export as CSV" frontIconName="material-symbols:download" frontIconHeght="24" frontIconWidth="24" className="p-1 px-2 rounded font-semibold text-md" bgClass="" textClass="text-primary dark:text-background" />
                </div>
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
            />
        </div>
    );
}

export default SubmissionsTab
