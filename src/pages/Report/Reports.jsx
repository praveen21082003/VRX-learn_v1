import React, { useState } from 'react'

import { Select, Avatar, StatusPill, Button, Modal, DeleteConfirmContent } from "@/components/ui"
import { TableToolbar, DataTable } from '@/components/Table'

// configs
import { REPORT_COLUMNS_BASE } from '@/config/tablesColumnConfig'
import { REPORT_CATEGORY_OPTIONS, REPORT_STATUS_OPTIONS, REPORT_ROLE_OPTIONS } from '@/config/adminFiltersSelectOptions'
import { useNavigate } from 'react-router-dom'

function Reports() {
  const INITIAL_FILTERS = {
    category: null,
    role: null,
    status: null
  };

  const navigate = useNavigate();

  // states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedRows, setSelectedRows] = useState([]);



  // data ===================================
  const reports = {
    "data": [
      {
        id: 1,
        name: "Arul S",
        email: "arullsampathcyr@gmail.com",
        role: "trainer",
        subject: "Submit button unresponsive in Week 2 Project",
        status: "pending",
        submitted_date: "2026-05-13",
      },

      {
        id: 2,
        name: "Priya K",
        email: "priya@gmail.com",
        role: "trainee",
        subject: "PDF viewer zoom not working on mobile",
        status: "resolved",
        submitted_date: "2026-05-12",
      },

      {
        id: 3,
        name: "Rahul M",
        email: "rahulMuddi@gmail.com",
        role: "trainer",
        subject: "Assignment upload fails for large files",
        status: "resolved",
        submitted_date: "2026-05-11",
      },

      {
        id: 4,
        name: "Sneha R",
        email: "1111praveenyeugula@gmail.com",
        role: "trainee",
        subject: "Course video stuck on loading screen",
        status: "pending",
        submitted_date: "2026-05-10",
      },

      {
        id: 5,
        name: "Karthik V",
        email: "karthik0856@gmail.com",
        role: "trainer",
        subject: "Incorrect attendance shown in reports",
        status: "pending",
        submitted_date: "2026-05-09",
      },

    ],
    "page": 1,
    "limit": 10,
    "totalItems": 5,
    "totalPages": 1
  };


  // ------------Table Columns------------
  const columns = REPORT_COLUMNS_BASE.map((col) => {

    switch (col.key) {

      case "user":
        return {
          ...col,
          render: (row) => (
            <div className="flex items-center text-main gap-2 hover:text-primary hover:font-bold hover:cursor-pointer" onClick={() => navigate(`/reports/${row.id}`)}>
              <Avatar name={row.name} />
              <div>
                <p className='text-body'>{row.name}</p>
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
      case "status":
        return {
          ...col,
          render: (row) => (
            <StatusPill status={row[col.key]} />
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
          data={reports.data}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={reports.totalItems}
        />
      </div>
    </div>
  )
}

export default Reports
