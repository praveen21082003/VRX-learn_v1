import React from 'react'
import { Input, Button } from '@/components/ui'

function TableToolBar({

    headerLabel,
    selectedRows = [],
    setSelectedRows,
    search,
    setSearch,
    onAdd,
    onExport,
    addLabel = "Add New",
    bulkActions, // Custom bulk action UI
    children,    // Custom filters go here
}) {

    const isMobile = window.innerWidth < 768;

    const isBulkActive = selectedRows.length > 0;


    return (
        <div className="space-y-4 h-28">

            <div className="flex items-center w-full h-10">
                <div className="flex-1">
                    {headerLabel && <h3 className="text-h3 font-semibold">{headerLabel}</h3>}
                </div>
                <div className="flex justify-end items-center gap-3">

                    {!isBulkActive && onExport && (
                        <Button
                            buttonName="Export as CSV"
                            frontIconName="material-symbols:download"
                            frontIconWidth="26"
                            frontIconHeght="26"
                            className="lg:p-3 lg:py-1.5 text-sm rounded-md"
                            bgClass=""
                            textClass="lg:text-body"
                            onClick={onExport}
                            isMobile={isMobile}

                        />
                    )}
                    {!isBulkActive && onAdd && (
                        <Button
                            buttonName={addLabel}
                            frontIconName="mdi:plus"
                            frontIconWidth="26"
                            frontIconHeght="26"
                            className="lg:p-3 lg:py-1.5 text-sm rounded-md"
                            bgClass="lg:bg-primary"
                            textClass="lg:text-white"
                            onClick={onAdd}
                            isMobile={isMobile}
                        />
                    )}
                </div>
            </div>


            {isBulkActive ? (
                <div className="flex justify-between items-center py-5 gap-3  whitespace-nowrap">
                    <div className="flex gap-8 px-2">
                        <span>{selectedRows.length} Rows selected</span>
                        <Button
                            frontIconName="maki:cross"
                            frontIconHeght="16"
                            frontIconWidth="16"
                            bgClass=""
                            textClass=""
                            onClick={() => setSelectedRows([])}
                        />
                    </div>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                        <p className="text-sm font-medium">Bulk Actions:</p>
                        {bulkActions ? (
                            <>
                                {bulkActions}
                            </>
                        ) : (
                            <p className="text-xs italic text-muted">
                                Selection enabled (Actions coming soon)
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-96">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon="ic:twotone-search"
                            border="border-default"
                            paddingClass="py-2"
                            widthClass="w-full md:w-96"
                            placeholder="Search by name or email..."
                        />
                    </div>
                    {/* Specific Filters passed from the parent page */}
                    <div className="flex flex-wrap items-center gap-3">
                        {children}
                    </div>
                </div>
            )}

        </div>
    )
}

export default TableToolBar
