import React from 'react'
import { Input, Button } from '@/components/ui'

function TableToolBar({
    headerLabel,
    headerCaption,
    selectedRows = [],
    setSelectedRows,
    search,
    searchPlaceholder = "Search by name or email...",
    setSearch,
    onAdd,
    onExport,
    exportLoading = false,
    addLabel = "Add New",
    bulkActions,
    children,
}) {
    // Standardize mobile check
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isBulkActive = selectedRows.length > 0;

    return (
        /* CHANGE: Removed h-28 (fixed) and added min-h-[112px] (which is exactly 28rem).
           Added h-auto so it grows if content wraps on mobile.
        */
        <div className="space-y-4 h-auto min-h-[112px] pb-2">

            {/* Header Row */}
            <div className="flex items-center justify-between w-full min-h-[40px]">
                <div className="flex-1">
                    {headerLabel && <h3 className="text-h3 font-semibold leading-tight">{headerLabel}</h3>}
                    {headerCaption && <div className="text-caption text-muted">{headerCaption}</div>}
                </div>

                <div className="flex justify-end items-center gap-3">
                    {!isBulkActive && onExport && (
                        <Button
                            buttonName={isMobile ? "" : exportLoading ? "Exporting CSV" : "Export as CSV"}
                            frontIconName="material-symbols:download"
                            frontIconWidth="24"
                            frontIconHeight="24"
                            className="lg:p-3 lg:py-1.5 text-sm rounded-md"
                            bgClass=""
                            textClass="lg:text-body"
                            onClick={onExport}
                        />
                    )}
                    {!isBulkActive && onAdd && (
                        <Button
                            buttonName={isMobile ? "" : addLabel}
                            frontIconName="mdi:plus"
                            frontIconWidth="24"
                            frontIconHeight="24"
                            className="lg:p-3 lg:py-1.5 text-sm rounded-md"
                            bgClass="lg:bg-primary"
                            textClass="lg:text-white"
                            onClick={onAdd}
                        />
                    )}
                </div>
            </div>

            {/* Content Row: Search & Filters OR Bulk Actions */}
            <div className="w-full">
                {isBulkActive ? (
                    <div className="flex flex-wrap justify-between items-center py-2 px-3 bg-primary/5 rounded-lg gap-3 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-sm">{selectedRows.length} Rows selected</span>
                            <Button
                                frontIconName="maki:cross"
                                frontIconHeight="14"
                                frontIconWidth="14"
                                bgClass="hover:bg-default/20 rounded-full p-1"
                                onClick={() => setSelectedRows([])}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-medium">Bulk Actions:</p>
                            <div className="flex items-center gap-2">
                                {bulkActions || (
                                    <p className="text-xs italic text-muted">Selection enabled</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        {/* Search Input Container */}
                        <div className="w-full lg:w-96">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                icon="ic:twotone-search"
                                border="border-default"
                                paddingClass="py-2"
                                widthClass="w-full"
                                placeholder={searchPlaceholder}
                            />
                        </div>

                        {/* Filters Container: Added flex-wrap for mobile safety */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TableToolBar;