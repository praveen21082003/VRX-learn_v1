//  Trainee roster for trainer 

import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import useTraineeRosterData from './hooks/useTraineeRosterData'
import formatDateTime from '@/utils/formatDateTime'
import { TRAINEE_ROSTER_BASE } from '@/config/tablesColumnConfig'

import { TableToolbar, DataTable } from '@/components/Table'

import { Icon, Input, Button, Avatar, StatusPill, Select, BackButton } from '@/components/ui'
import { ROLE_OPTIONS, TRAINEE_ROSTER_SORT_OPTIONS } from '../../config/adminFiltersSelectOptions'


function TraineeRoster() {

    const INITIAL_FILTERS = {
        search: "",
        role: null,
        sort: null,
    };

    const { courseId } = useParams();
    const { state } = useLocation();

    // hooks
    const { roster, loading } = useTraineeRosterData(courseId);


    // states
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const noOfTrainees = state.noOfTrainees


    // ------------Table Columns------------
    // Inside your Enrollments component:
    const getTraineeRosterColumns = () => {
        return TRAINEE_ROSTER_BASE.map((col) => {
            switch (col.key) {
                case "profile":
                    return {
                        ...col,
                        render: (row) => <Avatar name={row?.name || "NA"} />,
                    };

                case "name":
                    return {
                        ...col,
                        render: (row) => (
                            <span className="text-body">{row?.name || "-"}</span>
                        ),
                    };

                case "email":
                    return {
                        ...col,
                        render: (row) => (
                            <span className="text-body">{row?.email || "-"}</span>
                        ),
                    };

                case "enrollmentDate":
                    return {
                        ...col,
                        render: (row) => (
                            <span className="text-body">
                                {row?.enrollmentDate
                                    ? formatDateTime(row.enrollmentDate)
                                    : "-"}
                            </span>
                        ),
                    };

                case "role":
                    return {
                        ...col,
                        render: (row) => (
                            <StatusPill status={row?.role || "unknown"} />
                        ),
                    };

                default:
                    return col;
            }
        });
    };


    const finalColumns = [
        {
            key: "check_box",
            label: (
                <div className="flex justify-center">
                    <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                </div>
            ),
            align: "center",
            width: "5%",
            render: (row) => (
                <div className="flex justify-center">
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) =>
                            handleSelectRow(row.id, e.target.checked)
                        }
                    />
                </div>
            ),
        },
        ...getTraineeRosterColumns(),
    ];

    // --------------Table colums end-----------------


    // Handler functions

    // A single helper function to update any field when filters changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };


    return (
        <div className='h-full overflow-y-auto p-6 bg-background text-main'>
            <div className="mb-2 w-full hidden lg:block">
                <BackButton to={`/course/${courseId}/overview`} iconName="material-symbols:arrow-back-rounded" label="Back to Overview" />
            </div>
            <div className="p-4 border border-default rounded-lg">
                <TableToolbar
                    headerLabel='Trainee Roster'
                    headerCaption={
                        <div className="flex items-center gap-2 text-caption text-muted">
                            <Icon name="mdi:users" height="16" width="16" />
                            <span>{noOfTrainees} Trainees Enrolled</span>
                        </div>
                    }
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    search={filters.search}
                    setSearch={(val) => handleFilterChange('search', val)}
                >
                    <Select
                        label="Sort by:"
                        value={filters.sort}
                        onChange={(value) => handleFilterChange('sort', value)}
                        options={TRAINEE_ROSTER_SORT_OPTIONS}
                    />
                    <Select
                        label="Role:"
                        value={filters.role}
                        onChange={(value) => handleFilterChange('role', value)}
                        options={ROLE_OPTIONS}
                    />
                </TableToolbar>
                <DataTable
                    loading={loading}
                    selectedRows={selectedRows}
                    columns={finalColumns}
                    data={roster}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    total={roster.totalPages}
                />
            </div>
        </div>
    );
}


export default TraineeRoster

