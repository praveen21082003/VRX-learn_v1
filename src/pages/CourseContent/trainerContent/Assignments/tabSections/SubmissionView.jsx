import React, { useEffect, useState } from "react";
import { Button, Avatar, StatusPill, Icon, Input } from "@/components/ui";
import useAssignmentSubmissions from "../hooks/useAssignmentSubmissions";
import DocumentControls from "@/components/content/document/DocumentControls";
import useMedia from '@/components/content/hook/useMedia';
import { useToast } from "@/context/ToastProvider";

function SubmissionView({ setActiveTab, activeAssignmentId, submissions }) {
    const { addToast } = useToast();

    const [evaluation, setEvaluation] = useState({
        score: "",
        feedback: ""
    });
    const [warning, setWarning] = useState({});

    // ✅ use correct hook names from your hook
    const {
        submissionData,
        submissionLoading,
        submissionError,
        fetchSubmissionData,
        grading,
        gradeError,
        gradeSubmission,
    } = useAssignmentSubmissions(null, null);

    const mediaId = submissionData?.mediaId;
    const { url, loading: mediaLoading } = useMedia(mediaId);

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
    const validate = () => {
        const errors = {};
        if (evaluation.score === "" || evaluation.score === null) {
            errors.score = "Grade is required";
        } else if (Number(evaluation.score) < 0) {
            errors.score = "Grade cannot be negative";
        } else if (Number(evaluation.score) > submissionData?.maxScore) {
            errors.score = `Grade cannot exceed max score (${submissionData?.maxScore})`;
        }
        return errors;
    };

    const handleSubmit = async () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setWarning(errors);
            return;
        }

        const original = submissionData || {};
        const payload = {};

        if (Number(evaluation.score) !== original?.score) {
            payload.score = Number(evaluation.score);
        }
        if (evaluation.feedback?.trim() !== (original?.feedback || "").trim()) {
            payload.feedback = evaluation.feedback?.trim() || null;
        }

        if (Object.keys(payload).length === 0) {
            addToast("No changes made", "info");
            return;
        }

        const result = await gradeSubmission(activeAssignmentId, payload);
        if (result.success) {
            addToast("Graded successfully", "success");
        } else {
            addToast(result.message, "error");
        }
    };

    // loading
    if (submissionLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Icon name="line-md:loading-twotone-loop" height="30" width="30" />
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
            <header className="flex items-center gap-4 flex-wrap">
                <Button
                    frontIconName="famicons:arrow-back-sharp"
                    frontIconWidth="20px"
                    frontIconHeght="20px"
                    bgClass=""
                    textClass=""
                    onClick={() => setActiveTab("submissions")}
                />

                <div className="flex items-center justify-between gap-3 px-4 py-2 border border-default rounded min-w-64">
                    <div className="flex items-center gap-2">
                        <Avatar name={submissionData?.submitterName} />
                        <span className="font-medium truncate">{submissionData?.submitterName}</span>
                    </div>
                    <StatusPill status={submissionData?.status} />
                </div>

                {/* next/prev — placeholder for dropdown later */}
                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        frontIconName="mingcute:left-fill"
                        frontIconHeght="24"
                        frontIconWidth="24"
                        bgClass=""
                        textClass=""
                    // TODO: handle prev submission navigation
                    />
                    <Button
                        frontIconName="mingcute:right-fill"
                        frontIconHeght="24"
                        frontIconWidth="24"
                        bgClass=""
                        textClass=""
                    // TODO: handle next submission navigation
                    />
                </div>
            </header>

            {/* main content */}
            <main className="flex flex-col lg:flex-row gap-4">

                {/* document viewer */}
                <section className="flex-1 min-w-0">
                    <DocumentControls
                        title={submissionData?.filename}
                        fileUrl={url}
                        key={submissionData?.id}
                        loading={mediaLoading}
                    />
                </section>

                {/* grading panel */}
                <aside className="w-full lg:w-80 p-4 space-y-5 border border-default rounded">

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
                        />
                        <span className="text-caption text-muted">
                            Out of {submissionData?.maxScore ?? "—"} points
                        </span>
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
                            buttonName={grading ? "Grading..." : "Submit Grade"}
                            className="px-4 py-2 rounded"
                            disabled={grading}
                            onClick={handleSubmit}
                        />
                    </div>

                </aside>
            </main>
        </div>
    );
}

export default SubmissionView;