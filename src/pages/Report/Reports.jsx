import React, { useEffect, useState } from 'react'

// hooks
import { useReportsData } from './Hooks/useReportsData'
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// utils
import formatDateTime from '@utils/formatDateTime'

import { Select, Avatar, StatusPill, Button, Modal, DeleteConfirmContent } from "@/components/ui"
import { TableToolbar, DataTable } from '@/components/Table'

// configs
import { REPORT_COLUMNS_BASE } from '@/config/tablesColumnConfig'
import { REPORT_CATEGORY_OPTIONS, REPORT_STATUS_OPTIONS, REPORT_ROLE_OPTIONS } from '@/config/adminFiltersSelectOptions'
import { useNavigate } from 'react-router-dom'

function Reports() {

  useDocumentTitle("Reports");

  const INITIAL_FILTERS = {
    category: null,
    role: null,
    status: null
  };

  const navigate = useNavigate();
  const {
    reports,
    setReports,
    loading,
    error,
    total,
    refreshReports
  } = useReportsData();

  // states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedRows, setSelectedRows] = useState([]);

  const issuesCategoryMap = {
    "account-access": "Account Access",
    "assignment": "Assignment",
    "bug": "Technical Bug",
    "course-content": "Course Content & Materials",
    "other": "Other",
  };

  // ------------Table Columns------------
  const columns = REPORT_COLUMNS_BASE.map((col) => {

    switch (col.key) {

      case "user":
        return {
          ...col,
          render: (row) => (
            <div className="flex items-center text-main gap-2 hover:text-primary hover:font-bold hover:cursor-pointer" onClick={() => navigate(`/reports/${row.id}`)}>
              <Avatar name={row.username} />
              <div>
                <p className='text-body'>{row.username}</p>
                <p className="text-caption">{row.email}</p>
              </div>
            </div>
          ),
        };

      case "role":
        return {
          ...col,
          render: (row) => (
            <StatusPill status={row[col.key]} />
          ),
        };

      case "category":
        return {
          ...col,
          render: (row) => (
            <p>{issuesCategoryMap[row.category]}</p>
          )
        }

      case "subject":
        return {
          ...col,
          render: (row) => (
            <p title={row.subject} className='flex h-10 overflow-hidden items-center leading-5 line-clamp-2'>
              {row.subject}
            </p>
          )
        }
      case "status":
        return {
          ...col,
          render: (row) => (
            <StatusPill status={row[col.key]} />
          )
        }

      case "submittedAt":
        return {
          ...col,
          render: (row) => (
            <span className="text-caption text-muted">{formatDateTime(row.submittedAt)}</span>
          )
        }

      case "view":
        return {
          ...col,
          render: (row) => {

            return (
              <div className="flex items-center justify-center gap-3">
                <Button
                  frontIconName="iconamoon:eye-light"
                  frontIconHeight="18" frontIconWidth="18" bgClass="" textClass=""
                  onClick={() => navigate(`/reports/${row.id}`)}
                />
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
    ...columns,
  ];
  // --------------Table colums end-----------------

  useEffect(() => {

    const { category, role, status } = filters;

    const params = {
      page: page,
      limit: pageSize,
      category: category || undefined,
      role: role || undefined,
      status: status || undefined,
    }

    Object.keys(params).forEach(key =>
      (params[key] === undefined || params[key] === null) && delete params[key]
    );

    refreshReports(params);

  }, [page, pageSize, filters.role, filters.category, filters.status, refreshReports]);




  // Handle functions



  // Select All rows 
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(enrollments.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  // filters handler
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // setPage(1);
  };

  // Clear Filters
  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };




  return (
    <div className="w-full md:h-auto h-full flex flex-col bg-transparent text-main">
      <div className="p-4 shrink-0">
        <TableToolbar
          headerLabel="Reports"

        >
          <Select
            label="Category:"
            value={filters.category}
            onChange={(value) => handleFilterChange('category', value)}
            options={REPORT_CATEGORY_OPTIONS}
          />
          <Select
            label="Status:"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={REPORT_STATUS_OPTIONS}
          />
          <Select
            label="Role:"
            value={filters.role}
            onChange={(value) => handleFilterChange('role', value)}
            options={REPORT_ROLE_OPTIONS}
          />

        </TableToolbar>

      </div>


      {/* table */}
      <div className="md:px-4 md:pb-4 h-full px-2 pb-4 min-h-0">
        <DataTable
          selectedRows={selectedRows}
          columns={finalColumns}
          data={reports}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={total}
          loading={loading}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  )
}

export default Reports
