import React, { useEffect, useState } from "react";
import GradeImg from "@/assets/images/Grade.svg"

import useViewUrl from '@/hooks/useViewUrl'

import { Button, Avatar, StatusPill, Icon, Input } from "@/components/ui";
import { useClickOutside } from '@/hooks/useClickOutside'

import { attachmentViewUrl } from '@services/AssignmentSubmission.service'

import useAssignmentSubmissions from "../hooks/useAssignmentSubmissions";
import DocumentLayout from "@/components/content/document/DocumentLayout";
// import useMedia from '@/components/content/hook/useMedia';
import { useToast } from "@/context/ToastProvider";

function SubmissionView({ setActiveTab, activeAssignmentId, setActiveAssignmentId, submissions, refreshSubmissions }) {
    const { addToast } = useToast();
    const [isOpen, ref, setIsOpen, toggle] = useClickOutside();


    const [evaluation, setEvaluation] = useState({
        score: "",
        feedback: ""
    });
    const [warning, setWarning] = useState({});

    // use hook 
    const {
        submissionData,
        submissionLoading,
        submissionError,
        fetchSubmissionData,
        grading,
        gradeError,
        gradeSubmission,
        updateFeedback,
        refetch
    } = useAssignmentSubmissions(null, null);

    const assignmentSubmissionId = submissionData?.id;
    // const { url, loading: mediaLoading } = null;

    const ASSIGNMENT_SUBMISSION_ERRORS = {
        403: "You do not have access to this submission.",
        404: "The submission file is unavailable.",
        500: "Unable to load the submission. Please try again later.",
    };

    const {
        url,
        loading: mediaLoading,
        error
    } = useViewUrl(
        assignmentSubmissionId,
        attachmentViewUrl,
        ASSIGNMENT_SUBMISSION_ERRORS
    )

    // status check var
    const isAlreadyGraded = submissionData?.status === "graded";

    // fetch on mount when activeAssignmentId changes
    useEffect(() => {
        if (activeAssignmentId) {
            fetchSubmissionData(activeAssignmentId);
        }
    }, [activeAssignmentId]);

    // populate evaluation from fetched data
    useEffect(() => {
        if (submissionData) {
            setEvaluation({
                score: submissionData.score ?? "",
                feedback: submissionData.feedback || ""
            });
        }
    }, [submissionData]);

    const handleChange = (field, value) => {
        setEvaluation(prev => ({ ...prev, [field]: value }));
        setWarning(prev => ({ ...prev, [field]: null }));
    };

    // validation
    // skip score validation if already graded
    const validate = () => {
        const errors = {};
        if (!isAlreadyGraded) {
            if (evaluation.score === "" || evaluation.score === null) {
                errors.score = "Grade is required";
            } else if (Number(evaluation.score) < 0) {
                errors.score = "Grade cannot be negative";
            } else if (Number(evaluation.score) > submissionData?.maxScore) {
                errors.score = `Grade cannot exceed max score (${submissionData?.maxScore})`;
            }
        }
        return errors;
    };

    //----------------- handle functions -------------------------------

    // Submit function
    const handleSubmit = async () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setWarning(errors);
            return;
        }

        if (isAlreadyGraded) {
            // only feedback can change
            const originalFeedback = (submissionData?.feedback || "").trim();
            const newFeedback = (evaluation.feedback || "").trim();

            if (newFeedback === originalFeedback) {
                addToast("No changes made", "info");
                return;
            }

            const result = await updateFeedback(activeAssignmentId, newFeedback || null);
            if (result.success) {
                fetchSubmissionData(activeAssignmentId);
                addToast(result.message, "success");
            } else {
                addToast(result.message, "error");
            }

        } else {
            // first time grading — verify
            const payload = {};
            if (evaluation.score !== "") payload.score = Number(evaluation.score);
            if (evaluation.feedback?.trim()) payload.feedback = evaluation.feedback.trim();

            if (Object.keys(payload).length === 0) {
                addToast("No changes made", "info");
                return;
            }

            const result = await gradeSubmission(activeAssignmentId, payload);
            if (result.success) {
                fetchSubmissionData(activeAssignmentId); // refresh current submission data
                refetch();
                refreshSubmissions();
                addToast("Graded successfully", "success");
            } else {
                addToast(result.message, "error");
            }
        }
    };

    // find current index
    const currentIndex = submissions?.findIndex(s => s.id === activeAssignmentId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < (submissions?.length - 1);

    // previous submission
    const handlePrev = () => {
        if (hasPrev) {
            const prevId = submissions[currentIndex - 1].id;
            setActiveAssignmentId(prevId);
        }
    };

    // next submission
    const handleNext = () => {
        if (hasNext) {
            const nextId = submissions[currentIndex + 1].id;
            setActiveAssignmentId(nextId);
        }
    };

    // loading
    if (submissionLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-40 gap-3">
                <Icon name="line-md:loading-twotone-loop" height="30" width="30" />
                <p className="text-caption text-muted">Loading submission...</p>
            </div>
        );
    }

    // error
    if (submissionError) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-red-500">
                <Icon name="fluent:mail-error-16-filled" height="40" width="40" />
                <p>{submissionError}</p>
            </div>
        );
    }

    // no data
    if (!submissionData) return null;

    return (
        <div className="space-y-6">

            {/* header */}
            <header className="flex items-center lg:gap-4 flex-wrap">
                <Button
                    frontIconName="famicons:arrow-back-sharp"
                    frontIconWidth="20px"
                    frontIconHeght="20px"
                    bgClass=""
                    textClass=""
                    onClick={() => setActiveTab("submissions")}
                />

                <div className="relative w-full lg:w-96 no-select" ref={ref}>


                    {/* Trigger */}
                    <div
                        className="flex justify-between px-4 py-2 border border-default rounded bg-menu-header w-full cursor-pointer"
                    >
                        <Button
                            frontIconName="mingcute:left-fill"
                            frontIconHeght="24"
                            frontIconWidth="24"
                            bgClass=""
                            textClass=""
                            disabled={!hasPrev}
                            onClick={handlePrev}
                            className="block lg:hidden"
                        />

                        <div className="flex items-center justify-between w-full" onClick={toggle}>
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Avatar name={submissionData?.submitterName} className="shrink-0" />
                                <span className="font-medium truncate">{submissionData?.submitterName}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <StatusPill status={submissionData?.status} />
                                <Icon
                                    name="iwwa:arrow-down"
                                    height="16" width="16"
                                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                            </div>
                        </div>

                        <Button
                            frontIconName="mingcute:right-fill"
                            frontIconHeght="24"
                            frontIconWidth="24"
                            bgClass=""
                            textClass=""
                            disabled={!hasNext}
                            onClick={handleNext}
                            className="block lg:hidden"
                        />
                    </div>


                    {/* Dropdown */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 border border-default rounded bg-background shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-hide w-full">
                            {submissions?.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setActiveAssignmentId(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-primary/16 cursor-pointer transition-colors
                                        ${item.id === activeAssignmentId ? "bg-primary/16" : ""}
                                    `}
                                >
                                    {/* Left: avatar + name/email */}
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <Avatar name={item.username} className="shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-h5 truncate">{item.username}</p>
                                            <p className="text-caption text-muted truncate">{item.email}</p>
                                        </div>
                                    </div>

                                    {/* Right: status + score — fixed width, never shrinks */}
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <StatusPill status={item.status} />
                                        <span className="text-caption text-muted whitespace-nowrap">
                                            {item.status === "graded" ? item.score : "--"}/{item.maxScore}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* next/prev — placeholder for dropdown later */}
                <div className="hidden lg:flex items-center gap-2 lg:ml-10">
                    <Button
                        frontIconName="mingcute:left-fill"
                        frontIconHeght="24"
                        frontIconWidth="24"
                        bgClass=""
                        textClass=""
                        disabled={!hasPrev}
                        onClick={handlePrev}
                    />
                    <span className="text-caption text-muted">
                        {currentIndex + 1} / {submissions?.length}
                    </span>
                    <Button
                        frontIconName="mingcute:right-fill"
                        frontIconHeght="24"
                        frontIconWidth="24"
                        bgClass=""
                        textClass=""
                        disabled={!hasNext}
                        onClick={handleNext}
                    />
                </div>
            </header>

            {/* main content */}
            <main className="flex flex-col lg:flex-row gap-4">

                {/* document viewer */}
                <section className="flex-1 min-w-0">
                    <DocumentLayout
                        title={submissionData?.filename}
                        fileUrl={url}
                        key={submissionData?.id}
                        loading={mediaLoading}
                    />
                </section>

                {/* grading panel */}
                <aside className="w-full lg:w-80 p-4 space-y-3">

                    <div className="space-y-1">
                        <Input
                            label="Grade"
                            type="number"
                            min="0"
                            max={submissionData?.maxScore}
                            paddingClass="p-2"
                            value={evaluation.score}
                            onChange={(e) => handleChange("score", e.target.value)}
                            inputWarning={warning.score}
                            disabled={isAlreadyGraded} // locked after grading cant change
                            border="border-default"

                        />
                        <span className="text-caption text-muted">
                            Out of {submissionData?.maxScore ?? "—"} points
                        </span>
                        {isAlreadyGraded && (
                            <p className="text-caption text-muted italic">
                                Grade cannot be changed once submitted
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-h5">Feedback</label>
                        <textarea
                            rows="8"
                            placeholder="Provide feedback for the student..."
                            className="w-full border-2 text-body border-default rounded p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            value={evaluation.feedback}
                            onChange={(e) => handleChange("feedback", e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            buttonName={
                                grading
                                    ? "Saving..."
                                    : isAlreadyGraded
                                        ? "Update Feedback"
                                        : "Submit Grade"
                            }
                            className="px-4 py-2 rounded"
                            disabled={grading}
                            onClick={handleSubmit}
                        />
                    </div>
                    <div className="hidden w-full lg:flex justify-center ">
                        <img
                            src={GradeImg}
                            alt="grading"
                            className="w-56"
                        />
                    </div>

                </aside>
            </main>
        </div>
    );
}

export default SubmissionView;