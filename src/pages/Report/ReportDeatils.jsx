import React, { useEffect, useState } from 'react'

// hook
import { useReportIssues } from './Hooks/useReportIssuse'
import { useToast } from "@/context/ToastProvider";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// utils
import formatDateTime from '@utils/formatDateTime'
import useMedia from '@/components/content/hook/useMedia'

import { BackButton, Button, StatusPill, Select, Icon, AttachmentCard } from '@/components/ui'
import { useParams } from 'react-router-dom'

import { REPORT_STATUS_OPTIONS_IN_DETAILS_PAGE } from '@/config/adminFiltersSelectOptions'



function ReportDetails() {

    const { reportId } = useParams();
    const { addToast } = useToast();

    const {
        getIssue,
        updateIssue,
        loading,
        updating,
        fetchError,
        issue,
    } = useReportIssues();

    useDocumentTitle(
        issue?.subject
            ? `Report - ${issue.subject}`
            : "Report Details"
    );


    const {
        role,
        username,
        email,
        submittedAt
    } = issue?.submittedBy || {};

    const mediaId = issue?.media?.id;

    const { url, loading: mediaLoading } = useMedia(mediaId);

    const [status, setStatus] = useState("");



    useEffect(() => {
        if (reportId) {
            getIssue(reportId);
        }
    }, [reportId, getIssue]);

    useEffect(() => {
        if (issue?.status) {
            setStatus(issue.status);
        }
    }, [issue]);

    const issuesCategoryMap = {
        "account-access": "Account Access",
        "assignment": "Assignment",
        "bug": "Technical Bug",
        "course-content": "Course Content & Materials",
        "other": "Other",
    };


    // handle status change

    const handleUpdateStatus = async () => {

        if (!reportId) return;


        const response = await updateIssue(
            reportId,
            status,
        );

        if (response.success) {

            addToast(
                response.message || "Status updated successfully",
                "success"
            );

            // optional local update
            setIssue(prev => ({
                ...prev,
                status,
            }));

        } else {

            addToast(
                response.message || "Failed to update status",
                "error"
            );
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full gap-4">

                <Icon
                    name="line-md:loading-twotone-loop"
                    height="30"
                    width="30"
                />

                <div className="space-y-1 text-center">

                    <h3 className="text-h45 font-semibold text-main">
                        Loading Report Details...
                    </h3>

                    <p className="text-caption text-muted">
                        Fetching report information and attachments for review.
                    </p>

                </div>

            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-6 text-red-500">
                {fetchError}
            </div>
        );
    }


    return (
        <div className="px-6 py-5 space-y-6 text-main">

            {/* Back */}
            <BackButton label="Back" />

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div className="space-y-1">

                    <div className="flex flex-wrap items-baseline gap-2">

                        <h1 className="text-h3 font-semibold">
                            Report by {username}
                        </h1>

                        <span className="text-emphasis text-muted">
                            ({email})
                        </span>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <StatusPill status={role} />

                        <span className="text-emphasis text-muted">
                            Submitted on: {formatDateTime(submittedAt)}
                        </span>

                    </div>

                </div>

                {/* Status Select */}
                <div className="w-full lg:w-44">

                    <Select
                        label="Status:"
                        value={status}
                        options={REPORT_STATUS_OPTIONS_IN_DETAILS_PAGE}
                        onChange={(val) => setStatus(val)}
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
                        {issue?.subject}
                    </p>

                </div>

                {/* Category */}
                <div className="space-y-1">

                    <p className="text-h5 font-medium">
                        Category
                    </p>

                    <p className="text-body text-main">
                        {issuesCategoryMap[issue?.category]}
                    </p>

                </div>

            </div>

            {/* Description */}
            <div className="space-y-2">

                <p className="text-h5 font-medium">
                    Description
                </p>

                <p className="text-body text-main leading-7">
                    {issue?.description}
                </p>

            </div>

            {/* Attachment */}
            {issue?.media && (
                <div className="space-y-2">

                    <div className="flex items-center gap-1">

                        <p className="text-h5 font-medium">
                            Attachment
                        </p>

                    </div>


                    <AttachmentCard
                        fileName={issue?.media.filename}
                        url={url}
                        loading={mediaLoading}
                        mimeType={issue?.media.mimeType}
                    />
                </div>
            )}
            {status !== issue?.status &&
                <div className='flex justify-center'>

                    <Button
                        buttonName={updating ? "Updating..." : "Update Status"}
                        className="px-4 py-2 rounded-lg"
                        disabled={
                            updating ||
                            status === issue?.status
                        }
                        onClick={handleUpdateStatus}
                    />
                </div>
            }


        </div >
    )
}

export default ReportDetails
