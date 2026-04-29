import { useState, useEffect, useCallback, useRef } from "react";
import { getAssignmentSubmission } from "@/services/AssignmentContent.service";
import {
    getSubmission,
    patchSubmissionGrade,
    updateGradedFeedback
} from "@/services/AssignmentSubmission.service";

export default function useAssignmentSubmissions(assignmentId, params) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [submissionData, setSubmissionData] = useState(null);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const [grading, setGrading] = useState(false);
    const [gradeError, setGradeError] = useState(null);

    const isFetchingRef = useRef(false);

    // Fetch all submissions
    const fetchSubmissions = useCallback(async () => {
        if (!assignmentId || isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            setLoading(true);
            setError(null);

            const res = await getAssignmentSubmission(assignmentId, params);

            const data = res?.data || res || [];
            const list = Array.isArray(data) ? data : [];

            setSubmissions(list);
        } catch (err) {
            let message = "Failed to load submissions";

            if (err.response?.status === 404) message = "No submissions found";
            if (err.response?.status === 403) message = "No permission";
            if (err.response?.status >= 500) message = "Server error";

            setError(message);
            setSubmissions([]);
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, [assignmentId, params]);

    // Fetch single submission
    const fetchSubmissionData = useCallback(async (submissionId) => {
        if (!submissionId) {
            return {
                success: false,
                data: null,
                message: "Submission ID required",
            };
        }

        try {
            setSubmissionLoading(true);
            setSubmissionError(null);

            const res = await getSubmission(submissionId);
            const data = res?.data || res || null;

            setSubmissionData(data);

            return {
                success: true,
                data,
                message: "Submission loaded",
            };
        } catch (err) {
            let message = "Failed to load submission";

            if (err.response?.status === 404) message = "Submission not found";
            if (err.response?.status === 403) message = "No permission";

            setSubmissionError(message);
            setSubmissionData(null);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setSubmissionLoading(false);
        }
    }, []);

    // Grade submission
    const gradeSubmission = useCallback(async (submissionId, payload) => {
        if (!submissionId) {
            return {
                success: false,
                data: null,
                message: "Submission ID required",
            };
        }

        try {
            setGrading(true);
            setGradeError(null);

            const res = await patchSubmissionGrade(submissionId, payload);
            const data = res?.data || res;

            // optional: update local list (instant UI)
            setSubmissions((prev) =>
                prev.map((item) =>
                    item.id === submissionId ? { ...item, ...data } : item
                )
            );

            return {
                success: true,
                data,
                message: "Graded successfully",
            };
        } catch (err) {
            let message = "Failed to grade submission";

            if (err.response?.status === 400) message = "Invalid grading data";
            if (err.response?.status === 403) message = "No permission";

            setGradeError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setGrading(false);
        }
    }, []);


    // Update feedback
    const updateFeedback = useCallback(async (submissionId, feedback) => {
        if (!submissionId) {
            return { success: false, data: null, message: "Submission ID required" };
        }

        try {
            setGrading(true);
            setGradeError(null);

            const res = await updateGradedFeedback(submissionId, { feedback });
            const data = res?.data || res;

            setSubmissions(prev =>
                prev.map(item => item.id === submissionId ? { ...item, feedback } : item)
            );

            return { success: true, data, message: "Feedback updated successfully" };
        } catch (err) {
            let message = "Failed to update feedback";
            if (err.response?.status === 400) message = "Invalid feedback data";
            if (err.response?.status === 403) message = "No permission";
            setGradeError(message);
            return { success: false, data: null, message };
        } finally {
            setGrading(false);
        }
    }, []);



    // auto fetch
    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    return {
        submissions,
        loading,
        error,
        refetch: fetchSubmissions,

        submissionData,
        submissionLoading,
        submissionError,
        fetchSubmissionData,

        grading,
        gradeError,
        gradeSubmission,

        updateFeedback,
    };
}