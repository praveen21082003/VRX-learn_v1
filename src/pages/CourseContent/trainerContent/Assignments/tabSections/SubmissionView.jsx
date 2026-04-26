import React from 'react'
import { Button, Avatar } from '@/components/ui'

function SubmissionView({ setActiveTab, submitedData }) {
    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4 flex-wrap">
                <Button
                    frontIconName="famicons:arrow-back-sharp"
                    frontIconWidth="20px"
                    frontIconHeght="20px"
                    bgClass=""
                    textClass=""
                    onClick={() => setActiveTab("submissions")}
                />
                <div className="flex items-center justify-between gap-3 px-4 py-2 border border-default bg-submission dark:bg-transparent rounded min-w-64">
                    <div className="flex items-center gap-2">
                        <Avatar name={submitedData?.submitterName} />
                        <span className="font-medium truncate">{submitedData?.submitterName}</span>
                    </div>
                </div>
            </header>
            hello
        </div>
    )
}

export default SubmissionView
