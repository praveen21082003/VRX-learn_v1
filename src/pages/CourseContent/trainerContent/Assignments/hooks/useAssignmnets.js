import { useState, useCallback } from "react";
import {
    getTrainerAssignmentContent,
    getTrainerAssignmentDetail,
} from "@/services/AssignmentContent.service";

export default function useAssignmentContent() {
    const [assignments, setAssignments] = useState([]);
    const [assignment, setAssignment] = useState(null);

    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [error, setError] = useState(null);
    const [detailsError, setDetailsError] = useState(null);

    const fetchAssignments = useCallback(async (courseId) => {
        if (!courseId) {
            return {
                success: false,
                data: [],
                message: "Course ID is required",
            };
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getTrainerAssignmentContent(courseId);

            const data =
                response?.data ||
                response ||
                [];

            const assignmentsList = Array.isArray(data)
                ? data
                : [];

            setAssignments(assignmentsList);

            return {
                success: true,
                data: assignmentsList,
                message: "Assignments loaded successfully",
            };
        } catch (err) {
            let message = "Failed to load assignments";

            if (err.response?.status === 404) {
                message = "Assignments not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to view assignments";
            }

            if (err.response?.status >= 500) {
                message = "Server error while loading assignments";
            }

            setError(message);
            setAssignments([]);

            return {
                success: false,
                data: [],
                message,
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAssignmentDetails = useCallback(async (assignmentId) => {
        if (!assignmentId) {
            return {
                success: false,
                data: null,
                message: "Assignment ID is required",
            };
        }

        try {
            setDetailsLoading(true);
            setDetailsError(null);

            const response = await getTrainerAssignmentDetail(assignmentId);

            const data =
                response?.data ||
                response ||
                null;

            setAssignment(data);

            return {
                success: true,
                data,
                message: "Assignment details loaded successfully",
            };
        } catch (err) {
            let message = "Failed to load assignment details";

            if (err.response?.status === 404) {
                message = "Assignment not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to view this assignment";
            }

            if (err.response?.status >= 500) {
                message = "Server error while loading assignment details";
            }

            setDetailsError(message);
            setAssignment(null);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setDetailsLoading(false);
        }
    }, []);

    return {
        assignments,
        setAssignments,

        assignment,
        setAssignment,

        loading,
        detailsLoading,

        error,
        detailsError,

        fetchAssignments,
        fetchAssignmentDetails,
    };
}