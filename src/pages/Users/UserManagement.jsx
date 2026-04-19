import React, { useState, useEffect } from 'react'
import { useUsersData } from './hooks/useUsersData'
import { useUser } from './hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';

import { TableToolbar, DataTable, } from '@/components/Table'
import { Select, Avatar, StatusPill, Button, Modal, DeleteConfirmContent } from "@/components/ui"

import { ROLE_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from '@/config/adminFiltersSelectOptions'
import { USER_COLUMNS_BASE } from '../../config/tablesColumnConfig'

import formatDateTime from '@/utils/formatDateTime'



function UserManagement() {
    const INITIAL_FILTERS = {
        search: "",
        role: null,
        sort: null,
        status: null
    };


    const { refreshUsers, users, setUsers, loading, total, error } = useUsersData();
    const { deleteUser, deleting } = useUser();


    // useSates
    const [open, setOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    console.log(selectedUser);


    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [selectedRows, setSelectedRows] = useState([]);



    // fileters state
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const isSearchActive = filters.search.trim().length > 0;


    // Passing filters.search value to treger debounce for evety 500ms
    const debouncedSearch = useDebounce(filters.search, 500);



    // Table column Structure
    const columns = USER_COLUMNS_BASE.map((col) => {
        switch (col.key) {
            case "profile":
                return { ...col, render: (row) => <Avatar name={row.name} /> };

            case "role":
            case "status":
                return { ...col, render: (row) => <StatusPill status={row[col.key]} /> };

            case "lastLogin":
            case "createdAt":
                return { ...col, render: (row) => <span className="text-caption">{formatDateTime(row[col.key])}</span> };

            case "actions":
                return {
                    ...col,
                    render: (row) => {
                        const actions = ["mdi:delete-outline"]; //"mingcute:pencil-line",  ----> add ones after edit ready

                        return (
                            <div className="flex items-center justify-center gap-3">
                                {actions.map((icon, index) => (
                                    <Button
                                        key={index}
                                        frontIconName={icon}
                                        frontIconHeight="18"
                                        frontIconWidth="18"
                                        bgClass=""
                                        textClass=""
                                        onClick={() => {
                                            // if (icon === "mingcute:pencil-line") handleOpenEdit(row);
                                            if (icon === "mdi:delete-outline") handleOpenDelete(row);
                                        }}
                                    />
                                ))}
                            </div>
                        )
                    },
                };

            default:
                return col;
        }
    });

    const finalColumns = [
        {
            key: "check_box",
            label: (
                <div className="flex justify-center">
                    <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="accent-primary dark:accent-transparent"
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
                        className="accent-primary dark:accent-transparent"
                    />
                </div>
            ),
        },
        ...columns,
    ];
    // Table column Structure ---- End -----


    // A single helper function to update any field when filters changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

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
            setSelectedRows(users.map((row) => row.id));
        } else {
            setSelectedRows([]);
        }
    };

    // open edit box
    // const handleOpenEdit = (user) => {
    //     setEditingUser(user);
    //     setOpen(true);
    // };

    // delete action handeling
    const handleOpenDelete = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    // delete
    const handleDelete = async (userId) => {
        try {
            // console.log(selectedUser.id)
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            addToast("User deleted successfully", "success");
            setIsDelete(false);
        } catch (err) {
            addToast("Failed to delete user", "error");
        }
    }


    // fetch users data useEffect
    useEffect(() => {

        const sortMapping = {
            create_asc: { sortByCreatedAt: "asc" },
            create_desc: { sortByCreatedAt: "desc" },
            user_asc: { sortByUsername: "asc" },
            user_desc: { sortByUsername: "desc" },
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

        refreshUsers(params);

        // Dependency array now watches the 'filters' object or specific keys
    }, [page, pageSize, debouncedSearch, filters.role, filters.status, filters.sort, refreshUsers]);


    // Export Fuction
    const handleExport = () => {
        alert("export clciked")
    }

    return (
        <div className="w-full p-4 bg-transparent text-main border-b border-gray-200">
            <TableToolbar
                headerLabel="User Management"
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                search={filters.search}
                setSearch={(val) => handleFilterChange('search', val)}
                onAdd={() => setOpen(true)}
                onExport={() => handleExport()}
                addLabel="Add New User"
            // BulK Action ui can add here
            // eg : bulkActions={<div> Actions ui delete, etc,..., </div>}
            >

                <Select
                    label="Role:"
                    value={filters.role}
                    onChange={(val) => handleFilterChange('role', val)}
                    options={ROLE_OPTIONS}
                    disabled={isSearchActive}
                />

                <Select
                    label="Sort:"
                    value={filters.sort}
                    onChange={(val) => handleFilterChange('sort', val)}
                    options={SORT_OPTIONS}
                    disabled={isSearchActive}

                />

                <Select
                    label="Status:"
                    value={filters.status}
                    onChange={(val) => handleFilterChange('status', val)}
                    options={STATUS_OPTIONS}
                    disabled={isSearchActive}
                />
            </TableToolbar>

            {/* Table Component */}
            <div className="w-full overflow-x-auto">
                <DataTable
                    total={total}
                    loading={loading}
                    selectedRows={selectedRows}
                    columns={finalColumns}
                    data={users}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    clearFilters={clearFilters}
                // renderMobileCard={(row) => (
                //     <UserCard
                //         row={row}
                //         columns={usersManagementColumns}
                //     />
                // )}
                />
            </div>
            {open && (
                <Modal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    title="Are you absolutely sure?"
                >
                    <DeleteConfirmContent
                        confirmText={selectedUser?.name || ""}
                        entityName="user"
                        message={`You are about to permanently delete the ${selectedUser?.name} user.`}
                        loading={deleting}
                        onClose={() => setOpen(false)}
                        onConfirm={() => handleDelete(selectedUser.id)}
                    />
                </Modal>
            )}

        </div>
    )
}

export default UserManagement
