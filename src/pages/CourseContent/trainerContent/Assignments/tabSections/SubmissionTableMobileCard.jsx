import React from 'react'
import { Avatar, StatusPill, Button } from '@/components/ui'
import formatDateTime from '@/utils/formatDateTime'

function SubmissionTableMobileCard({ row, onView }) {
    return (
        <div className="border border-dashed border-primary/40 rounded-lg p-3 space-y-2">

            {/* top row — score + status */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <Avatar name={row?.username} />
                    <div>
                        <p className="text-h5 font-medium">{row?.username}</p>
                        <p className="text-caption text-muted">{row?.email}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-caption text-muted">
                        {row?.status === "graded" ? row?.score : "--"}/{row?.maxScore ?? 100}
                    </span>
                    <StatusPill status={row?.status} />
                </div>
            </div>

            {/* bottom row — attempt + date + view button */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-caption text-muted">
                    <span>Attempt: {row?.attempt ?? "--"}</span>
                    {row?.submittedAt && (
                        <>
                            <span>•</span>
                            <span>{formatDateTime(row?.submittedAt)}</span>
                        </>
                    )}
                </div>
                <Button
                    buttonName="View"
                    className="px-3 py-1 rounded border border-primary text-primary text-caption"
                    bgClass=""
                    textClass="text-primary"
                    onClick={onView}
                />
            </div>
        </div>
    )
}

export default SubmissionTableMobileCard