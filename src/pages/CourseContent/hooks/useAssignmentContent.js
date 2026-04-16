import { useState, useEffect, useCallback, useRef } from "react";
import {
    getTraineeAssignmentContent,
    getTraineeAssignmentDetail,
} from "@/services/AssignmentContent.service";

export const useAssignmentContent = (courseId, activeAssignmentId) => {
    const [assignments, setAssignments] = useState([]);
    const [assignmentDetail, setAssignmentDetail] = useState(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    const [error, setError] = useState(null);
    const [detailError, setDetailError] = useState(null);

    const contentFetchedRef = useRef(false);
    const detailFetchedRef = useRef(null);

    const fetchAssignments = useCallback(async () => {
        if (!courseId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await getTraineeAssignmentContent(courseId);

            setAssignments(response || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load assignments"
            );
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    const fetchAssignmentDetail = useCallback(async () => {
        if (!activeAssignmentId) return;

        try {
            setDetailLoading(true);
            setDetailError(null);

            const response = await getTraineeAssignmentDetail(
                activeAssignmentId
            );

            setAssignmentDetail(response);
        } catch (err) {
            setDetailError(
                err.response?.data?.message ||
                "Failed to load assignment details"
            );
        } finally {
            setDetailLoading(false);
        }
    }, [activeAssignmentId]);

    useEffect(() => {
        if (!courseId || contentFetchedRef.current) return;

        contentFetchedRef.current = true;
        fetchAssignments();
    }, [courseId, fetchAssignments]);

    useEffect(() => {
        if (
            !activeAssignmentId ||
            detailFetchedRef.current === activeAssignmentId
        ) {
            return;
        }

        detailFetchedRef.current = activeAssignmentId;
        fetchAssignmentDetail();
    }, [activeAssignmentId, fetchAssignmentDetail]);

    return {
        assignments,
        assignmentDetail,

        loading,
        detailLoading,

        error,
        detailError,

        refetchAssignments: fetchAssignments,
        refetchAssignmentDetail: fetchAssignmentDetail,
    };
};