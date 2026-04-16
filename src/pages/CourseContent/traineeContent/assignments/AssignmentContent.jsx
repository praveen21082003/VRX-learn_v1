import React, { useState, useEffect } from 'react'
import formatDateTime from "@/utils/formatDateTime";
import { BackButton, Icon, MarkdownContent, AttachmentCard, UploadSection } from '@/components/ui';
import { useOutletContext } from 'react-router-dom';
import useMedia from '@/components/content/hook/useMedia';

function AssignmentContent() {

    const [files, setFiles] = useState([]);

    const {
        courseId,
        activeAssignment,
        assignmentDetail,
        detailLoading,
    } = useOutletContext();


    const { assignment: assignmentData, attachment, submissions } = assignmentDetail || {};

    const mediaId = attachment?.mediaId;
    const { url, loading: mediaLoading } = useMedia(mediaId);



    const maxAttempts = assignmentData?.numberOfAttempts || 1;

    const [retake, setRetake] = useState(submissions?.length === 0);
    useEffect(() => {
        setRetake(submissions?.length === 0);
    }, [submissions?.length]);



    if (!activeAssignment) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select an assignment
            </div>
        );
    }


    if (detailLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                Loading assignment details...
            </div>
        );
    }


    return (
        <div className="overflow-y-auto w-full">
            <main
                // ref={scrollRef}
                className="flex-1 min-h-0 px-2 lg:p-3 lg:pt-5 pb-32"
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
                        <h1 className="text-h45 mt-6">Attachments</h1>

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
                        />
                    </div>
                )}
            </main>

        </div>
    )
}

export default AssignmentContent
