import React from "react";

function EnrollmentTableMobileCard({ row, columns }) {
    const getCol = (key) => columns.find((c) => c.key === key);

    return (
        <div className="relative p-3 mt-2 border border-default items-center rounded-sm shadow-sm">

            <div className="flex items-center gap-3 min-w-0">

                <div className="shrink-0">
                    {getCol("profile")?.render?.(row)}
                </div>


                <div className="flex flex-col min-w-0 overflow-hidden">


                    <p className="text-h5 text-main truncate">
                        {getCol("name")?.render
                            ? getCol("name").render(row)
                            : row.name}
                    </p>


                    <p className="text-caption text-main truncate">
                        {row.email}
                    </p>

                    <p className="text-caption text-main truncate">
                        {row.course_name}
                    </p>

                    <p className="text-caption text-muted mt-1">
                        Enrolled on: {getCol("date")?.render?.(row)}
                    </p>
                </div>
            </div>


            <div className="absolute  top-3 right-3 flex flex-col items-end justify-between gap-2 shrink-0">

                <div className=" top-3 right-3 flex items-end gap-1">
                    {getCol("status")?.render?.(row)}
                    {getCol("role")?.render?.(row)}
                </div>

                <div className="flex gap-2">
                    {getCol("actions")?.render?.(row)}
                </div>
            </div>
        </div>
    );
}

export default EnrollmentTableMobileCard;
