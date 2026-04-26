import React from "react";

// UserTableMobileCard.jsx
function UserTableMobileCard({ row, columns }) {
    const getCol = (key) => columns.find((c) => c.key === key);

    return (
        <div className="relative p-2 border border-default rounded-lg shadow-sm bg-white dark:bg-muted/5">

            {/* 1. BADGES: Keep absolute but ensure they are contained */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                {getCol("role")?.render?.(row)}
                {getCol("status")?.render?.(row)}
            </div>

            {/* 2. MAIN CONTENT: Add pt-6 or pr-24 to avoid the absolute badges */}
            <div className="flex items-center gap-3 pr-24">
                <div className="shrink-0">
                    {getCol("profile")?.render?.(row)}
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="text-h5 font-bold text-main truncate leading-tight">
                        {getCol("name")?.render ? getCol("name").render(row) : row.name}
                    </div>
                    <div className="text-caption text-main truncate">
                        {row.email}
                    </div>
                    <div className="text-[10px] text-muted mt-2">
                        Created: {getCol("createdAt")?.render?.(row)}
                    </div>
                </div>
            </div>

            {/* 3. ACTIONS: Move them to a logical spot */}
            <div className="absolute bottom-3 right-3">
                {getCol("actions")?.render?.(row)}
            </div>
        </div>
    );
}

export default UserTableMobileCard;