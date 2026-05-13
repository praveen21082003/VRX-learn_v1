import React from 'react'
import { BackButton, StatusPill, Select, Icon, AttachmentCard } from '@/components/ui'
import { useParams } from 'react-router-dom'

import { REPORT_STATUS_OPTIONS } from '@/config/adminFiltersSelectOptions'



function ReportDeatils() {

    const { reportId } = useParams();

    const details = [
        {
            id: 1,
            name: "Arul S",
            email: "arullsampathcyr@gmail.com",
            role: "trainer",
            subject: "Submit button unresponsive in Week 2 Project",
            description:
                "When I attempt to submit the Week 2 project assignment, the submit button stops responding after hover. The loading spinner appears briefly but nothing happens afterward. I tested this on both Chrome and Safari with the same issue.",
            status: "Pending",
            submitted_date: "2026-05-13",
            attachment: {
                name: "submit-button-error.png",
                type: "image/png",
                url: "https://picsum.photos/1200/800?random=1",
            }
        },

        {
            id: 2,
            name: "Priya K",
            email: "priya@gmail.com",
            role: "trainee",
            subject: "PDF viewer zoom not working on mobile",
            description:
                "Zoom gestures are not functioning correctly inside the PDF viewer on Android devices. Pinch-to-zoom sometimes freezes the viewer and scrolling becomes difficult after zooming in.",
            status: "In Progress",
            submitted_date: "2026-05-12",
        },

        {
            id: 3,
            name: "Rahul M",
            email: "rahulMuddi@gmail.com",
            role: "trainer",
            subject: "Assignment upload fails for large files",
            description:
                "Uploading assignment files larger than 50MB causes the upload progress bar to remain stuck at 100%. The page does not show any success or failure message afterward.",
            status: "Resolved",
            submitted_date: "2026-05-11",
            attachment: {
                name: "pdf-zoom-issue.jpeg",
                type: "image/jpeg",
                url: "https://picsum.photos/1200/800?random=2",
            }
        },

        {
            id: 4,
            name: "Sneha R",
            email: "1111praveenyeugula@gmail.com",
            role: "trainee",
            subject: "Course video stuck on loading screen",
            description:
                "The Week 4 course video keeps showing a loading spinner and never starts playback. Refreshing the page temporarily fixes it, but the issue comes back after navigating between modules.",
            status: "Pending",
            submitted_date: "2026-05-10",
        },

        {
            id: 5,
            name: "Karthik V",
            email: "karthik0856@gmail.com",
            role: "trainer",
            subject: "Incorrect attendance shown in reports",
            description:
                "Attendance reports for multiple trainees are displaying incorrect completion percentages. Some users who attended all sessions are marked below 50% attendance.",
            status: "Closed",
            submitted_date: "2026-05-09",
            attachment: {
                name: "video-loading-error.png",
                type: "image/png",
                url: "https://picsum.photos/1200/800?random=3",
            }
        },
    ]


    const detail = reportId
        ? details.find(r => r.id === Number(reportId))
        : null;

    if (!detail) {
        return (
            <div className="p-6">
                Report not found
            </div>
        );
    }


    return (
        <div className="px-6 py-5 space-y-6">

            {/* Back */}
            <BackButton label="Back" />

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div className="space-y-1">

                    <div className="flex flex-wrap items-baseline gap-2">

                        <h1 className="text-h3 font-semibold">
                            Report by {detail.name}
                        </h1>

                        <span className="text-emphasis text-muted">
                            ({detail.email})
                        </span>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <StatusPill status={detail.role} />

                        <span className="text-emphasis text-muted">
                            Submitted on: {detail.submitted_date}
                        </span>

                    </div>

                </div>

                {/* Status Select */}
                <div className="w-full lg:w-44">

                    <Select
                        label="Status:"
                        value={detail.status}
                        options={REPORT_STATUS_OPTIONS}
                    />

                </div>

            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">

                {/* Subject */}
                <div className="space-y-1">

                    <p className="text-h5 font-medium">
                        Subject
                    </p>

                    <p className="text-body text-main">
                        {detail.subject}
                    </p>

                </div>

                {/* Category */}
                <div className="space-y-1">

                    <p className="text-h5 font-medium">
                        Category
                    </p>

                    <p className="text-body text-main">
                        {detail.category}
                    </p>

                </div>

            </div>

            {/* Description */}
            <div className="space-y-2">

                <p className="text-h5 font-medium">
                    Description
                </p>

                <p className="text-body text-main leading-7">
                    {detail.description}
                </p>

            </div>

            {/* Attachment */}
            <div className="space-y-2">

                <div className="flex items-center gap-1">

                    <p className="text-h5 font-medium">
                        Attachment
                    </p>

                    <span className="text-small text-muted">
                        (optional)
                    </span>

                </div>

                {detail.attachment ? (
                    <AttachmentCard
                        fileName={detail.attachment.name}
                        url={detail.attachment.url}
                        fileType="img"
                    // loading={mediaLoading}
                    />
                ) : (

                    <div className="border border-dashed border-border w-60 rounded-md p-4 text-body text-muted">
                        No attachment provided
                    </div>

                )}

            </div>

        </div >
    )
}

export default ReportDeatils
