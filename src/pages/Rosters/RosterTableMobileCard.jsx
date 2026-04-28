import { Avatar, StatusPill } from '@/components/ui'
import formatDateTime from '@/utils/formatDateTime'

function RosterTableMobileCard({ row }) {
    return (
        <div className="flex items-center justify-between p-3 border border-default rounded-lg">
            <div className="flex items-center gap-3">
                <Avatar name={row?.name || "NA"} />
                <div>
                    <p className="text-h5 font-medium">{row?.name || "-"}</p>
                    <p className="text-caption text-muted">{row?.email || "-"}</p>
                    <p className="text-caption text-muted">
                        Enrolled on: {row?.enrollmentDate ? formatDateTime(row.enrollmentDate) : "N/A"}
                    </p>
                </div>
            </div>
            <StatusPill status={row?.role || "unknown"} />
        </div>
    )
}

export default RosterTableMobileCard