import { useState, useCallback } from "react";
import { deleteAssignmnet } from "@/services/Assignments.service";

export default function useDeleteAssignment() {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const deleteAssignment = useCallback(async (assignmentId) => {
        if (!assignmentId) {
            return {
                success: false,
                data: null,
                message: "Assignment ID is required",
            };
        }

        try {
            setDeleting(true);
            setError(null);

            const response = await deleteAssignmnet(assignmentId);

            return {
                success: true,
                data: response?.data || response,
                message: "Assignment deleted successfully",
            };
        } catch (err) {
            let message = "Failed to delete assignment";

            if (err.response?.status === 404) {
                message = "Assignment not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to delete this assignment";
            }

            if (err.response?.status >= 500) {
                message = "Server error while deleting assignment";
            }

            setError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setDeleting(false);
        }
    }, []);

    return {
        deleteAssignment,
        deleting,
        error,
        setError,
    };
}