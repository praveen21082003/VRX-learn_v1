import { useCallback, useState } from "react";
import {
    createEnrollment,
    deleteEnrollmentService,
    updateEnrollmentService,
} from "@/services/Enrollment.service";

export const useEnrollmentActions = () => {
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    // create enrollment
    const createNewEnrollment = useCallback(async (payload) => {
        try {
            setCreating(true);
            setError(null);
            const res = await createEnrollment(payload);
            return {
                success: true,
                data: res?.data || res,
                message: "Enrollment created successfully",
            };
        } catch (err) {
            let message = "Unable to create enrollment. Please try again.";
            if (err.response?.status === 400) message = "Please check the enrollment details.";
            if (err.response?.status === 409) message = "This user is already enrolled in this course.";
            if (err.response?.status === 403) message = "You do not have permission to create enrollments.";
            if (err.response?.status >= 500) message = "Server error while creating enrollment.";
            setError(message);
            return { success: false, data: null, message };
        } finally {
            setCreating(false);
        }
    }, []);

    // update enrollment
    const updateEnrollment = useCallback(async (enrollmentId, payload) => {
        try {
            setUpdating(true);
            setError(null);
            const res = await updateEnrollmentService(enrollmentId, payload);
            return {
                success: true,
                data: res?.data || res,
                message: "Enrollment updated successfully",
            };
        } catch (err) {
            let message = "Unable to update enrollment. Please try again.";
            if (err.response?.status === 404) message = "Enrollment not found.";
            if (err.response?.status === 403) message = "You do not have permission to update this enrollment.";
            if (err.response?.status >= 500) message = "Server error while updating enrollment.";
            setError(message);
            return { success: false, data: null, message };
        } finally {
            setUpdating(false);
        }
    }, []);

    // delete enrollment
    const deleteEnrollment = useCallback(async (enrollmentId) => {
        try {
            setDeleting(true);
            setError(null);
            const res = await deleteEnrollmentService(enrollmentId);
            return {
                success: true,
                data: res?.data || res,
                message: "Enrollment removed successfully",
            };
        } catch (err) {
            let message = "Unable to delete enrollment. Please try again.";
            if (err.response?.status === 404) message = "Enrollment not found.";
            if (err.response?.status === 403) message = "You do not have permission to delete this enrollment.";
            if (err.response?.status === 409) message = "This enrollment cannot be deleted right now.";
            if (err.response?.status >= 500) message = "Server error while deleting enrollment.";
            setError(message);
            return { success: false, data: null, message };
        } finally {
            setDeleting(false);
        }
    }, []);

    return {
        createNewEnrollment,
        updateEnrollment,
        deleteEnrollment,
        creating,
        updating,
        deleting,
        error,
        setError,
    };
};