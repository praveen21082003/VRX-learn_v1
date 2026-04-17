import React, { useState, useEffect } from 'react'
import { BackButton, Icon, MarkdownContent, AttachmentCard, UploadSection, StatusPill, Button } from '@/components/ui';

import formatDateTime from "@/utils/formatDateTime";

import { useOutletContext } from 'react-router-dom';

import useMedia from '@/components/content/hook/useMedia';
import { useAssignmentSubmission } from '../../hooks/useAssingmentSubmission';

import { useToast } from '@/context/ToastProvider'

import { useBreadcrumbs } from "@/context/BreadcrumbContext";

function AssignmentContent() {

    const [files, setFiles] = useState([]);
    const [openAttempt, setOpenAttempt] = useState(null);
    const { setSectionBreadcrumb } = useBreadcrumbs();

    const {
        courseId,
        activeAssignment,
        assignmentDetail,
        refetchAssignmentDetail,
        detailLoading,
    } = useOutletContext();
    const { addToast } = useToast()



    const { assignment: assignmentData, attachment, submissions } = assignmentDetail || {};
    const { submitAssignment, loading: submitting, uploadProgress, mediaStatus, loadedData } = useAssignmentSubmission();

    const mediaId = attachment?.mediaId;
    const { url, loading: mediaLoading } = useMedia(mediaId);


    const maxAttempts = assignmentData?.numberOfAttempts || 1;
    const attemptsArray = Array.from({ length: maxAttempts }, (_, i) => i + 1);

    // create a map of submissions with attempt number as key for easy access when rendering previous submissions
    // So That instead of iterating through submissions array multiple times to find the submission for each attempt,
    // we can just do submissionsMap[attemptNumber] to get the submission for that attempt in O(1) time. This is more efficient especially when there are many attempts and submissions.
    const submissionsMap = {};

    submissions?.forEach((sub) => {
        submissionsMap[sub.attempt] = sub;
    });


    // if there are no submissions, we want to show the upload section with the submit button.
    // If there are submissions, we want to hide the upload section and show the previous submissions instead. 
    // The user can click on "Retake" to show the upload section again and allow them to submit a new attempt (if they have attempts left).
    const [retake, setRetake] = useState(submissions?.length === 0);
    useEffect(() => {
        setRetake(submissions?.length === 0);
    }, [submissions?.length]);


    // format due date for display. If no due date, show "No due date provided"
    // N/A is returned from formatDateTime when assignmentData.dueDate is null or invalid, so we can use that to determine if we should show "No due date provided"
    const formattedDate = formatDateTime(assignmentData?.dueDate);
    const dueDateText = (formattedDate === "N/A") ? "No due date provided" : formattedDate;


    // Set the section breadcrumb to "Assignment" when this layout is active
    useEffect(() => {
        setSectionBreadcrumb(activeAssignment?.title);
        return () => setSectionBreadcrumb("");
    }, [activeAssignment?.title, setSectionBreadcrumb]);


    useEffect(() => {
        setFiles([]);
    }, [assignmentDetail?.id]);

    const getButtonText = () => {
        if (submitting && uploadProgress > 0 && uploadProgress < 100) {
            return "Uploading...";
        }

        if (submitting && mediaStatus === "processing") {
            return "Finishing...";
        }

        if (mediaStatus === "uploaded") {
            return "Done";
        }

        return "Submit";
    };

    const handleRefesh = () => {
        refetchAssignmentDetail();
    }



    const handleSubmit = async () => {


        if (files.length === 0) {
            addToast("Please upload a file first.", "warning");
            return;
        }

        const file = files[0];

        const payload = {
            assignmentSubmission: {
                assignmentId: assignmentData.id,
            },
            fileMetadata: {
                filename: file.name,
                content_type: file.type || "application/pdf",
                size: file.size,
            },
        };

        console.log("assignment submission", payload)

        try {
            await submitAssignment(payload, file);
            addToast("Assignment submitted successfully", "success");

            setFiles([]);
            handleRefesh?.();

        }
        catch (err) {
            addToast(err.message, "error");
        }
    }



    if (!activeAssignment) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select an assignment
            </div>
        );
    }


    if (detailLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
                <Icon name="line-md:loading-twotone-loop" height="30" width="30" />

                <div className="space-y-1 text-center">
                    <h3 className="text-h45 font-semibold text-main">Opening Assignment...</h3>
                    <p className="text-caption text-muted">
                        We're fetching the instructions and resources for your task.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="overflow-y-auto w-full">
            <main
                // ref={scrollRef}
                className="flex-1 text-main min-h-0 px-2 py-3 pb-32"
            >
                <div className=" flex justify-between">
                    <div>
                        <h1 className="flex gap-2 items-center text-h3">{activeAssignment?.title}</h1>
                        <div className="flex flex-col gap-2 text-caption text-muted text-dark-gray sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                            {[
                                {
                                    icon: "mdi:clock-outline",
                                    text: `Due: ${formatDateTime(assignmentData?.dueDate) || "No due date provided"}`
                                },
                                {
                                    icon: "streamline:star-badge-remix",
                                    text: `Max: ${assignmentData?.maxScore} Marks`
                                },
                                {
                                    icon: "ic:baseline-loop",
                                    text: `Max Attempts: ${assignmentData?.numberOfAttempts}`
                                }
                            ].map((item, index, array) => (
                                <React.Fragment key={item.text}>
                                    <div className="flex items-center gap-2">
                                        <Icon
                                            name={item.icon}
                                            width="16"
                                            height="16"
                                        />
                                        <p className="text-muted-foreground">
                                            {item.text}
                                        </p>
                                    </div>

                                    {index < array.length - 1 && (
                                        <span className="hidden sm:block">

                                            <Icon
                                                name="bi:dot"
                                                height="16"
                                                width="16"
                                            />
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    {submissions?.length > 0 && submissions?.length < maxAttempts && (
                        <Button
                            buttonName={retake ? "Cancel" : "Retake"}
                            frontIconName={retake ? "radix-icons:cross-2" : "ic:baseline-loop"}
                            frontIconHeight="26"
                            frontIconWidth="26"
                            bgClass=""
                            textClass=""
                            className="p-1 h-9 rounded"
                            onClick={() => setRetake((prev) => !prev)}
                        />
                    )}
                </div>
                <div className='mt-4'>
                    <MarkdownContent content={assignmentData?.instructions} label="Instructions" />
                </div>
                {attachment ? (
                    <>
                        <h1 className="text-h45 mt-6">Attachment</h1>

                        <div className="flex flex-wrap gap-3 mt-2">
                            <AttachmentCard
                                fileName={attachment.filename}
                                url={url}
                                loading={mediaLoading}
                            />
                        </div>
                    </>
                ) : null}

                {retake && (
                    <div className="mt-6 space-y-4">
                        <h2 className="text-caption font-semibold text-primary mb-2 uppercase tracking-wide">
                            {submissions?.length === 0
                                ? ""
                                : `New Submission: Attempt ${submissions.length + 1} of ${maxAttempts}`
                            }
                        </h2>
                        <UploadSection
                            files={files}
                            setFiles={setFiles}
                            uploadProgress={uploadProgress}
                            isUploading={submitting}
                            mediaStatus={mediaStatus}
                            loadedData={loadedData}
                        // allowedTypes={['pdf', 'mp4']}
                        />
                    </div>
                )}


                {!retake && (
                    <div className="mt-6 space-y-4">
                        {attemptsArray.map((attemptNumber) => {
                            const submission = submissionsMap[attemptNumber];

                            if (!submission) return null;

                            return (
                                <div key={attemptNumber} className="border rounded border-default bg-background overflow-hidden">
                                    <div className="flex bg-submission border-b border-default justify-between p-3 h-15 items-center">
                                        <div className="flex justify-center items-center gap-5">
                                            Attempt {attemptNumber} of {maxAttempts}
                                            {openAttempt !== attemptNumber && (
                                                <span className='hidden md:block'>
                                                    <p className="text-body">{submission.filename}</p>
                                                    <p className="text-caption text-muted">
                                                        Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                                    </p>
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            {/* Since we filtered above, status will now only be 'Graded' or 'Submitted' */}
                                            <StatusPill status={submission.status} />
                                            <Button
                                                frontIconName="iconamoon:arrow-down-2"
                                                frontIconHeight="26"
                                                frontIconWidth="26"
                                                bgClass=""
                                                textClass=""
                                                className={openAttempt === attemptNumber ? "rotate-180" : ""}
                                                onClick={() =>
                                                    setOpenAttempt(prev =>
                                                        prev === attemptNumber ? null : attemptNumber
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    {openAttempt === attemptNumber && (
                                        <div className="space-y-3 p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-2">
                                                    <Icon name="fluent:document-pdf-24-filled" height="36" width="36" />
                                                    <span className='w-60 md:w-96 lg:w-full'>
                                                        <p className="text-sm font-medium truncate">{submission.filename}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                                        </p>
                                                    </span>
                                                </div>
                                                {submission.score !== null && (
                                                    <span className="flex items-center font-semibold text-primary">
                                                        <p className="text-h3">{submission.score}</p>
                                                        / <p className="text-h5">{assignmentData.maxScore}</p>
                                                    </span>
                                                )}
                                            </div>
                                            {submission.score !== null && (
                                                <div className="flex gap-2 text-emphasis">
                                                    <label className="font-bold">Trainer Feedback: </label>
                                                    <p>{submission?.feedback || "No feedback provided"}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex w-full items-center justify-center mt-6">
                    {files.length > 0 && (
                        <Button
                            buttonName={getButtonText()}
                            onClick={handleSubmit}
                            bgClass="bg-primary"
                            textClass="text-white"
                            frontIconName={
                                submitting
                                    ? "line-md:loading-twotone-loop"
                                    : mediaStatus === "uploaded"
                                        ? "mdi:check-circle"
                                        : ""
                            }
                            frontIconHeight="15"
                            frontIconWidth="15"
                            className="p-2 rounded px-6 font-semibold transition-all hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
                            disabled={submitting || mediaStatus === "uploaded"}
                        />
                    )}
                </div>
            </main>

        </div>
    )
}

export default AssignmentContent
