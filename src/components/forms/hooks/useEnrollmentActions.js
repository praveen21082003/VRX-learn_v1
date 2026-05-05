import { useCallback, useState } from "react";
import {
    createEnrollment,
    deleteEnrollmentService,
    updateEnrollmentService,
} from "@/services/Enrollment.service";
import { extractErrorMessage } from '@/utils/errorUtils';


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

            const status = err.response?.status;

            const message = extractErrorMessage(/** @type {any} */(err), {
                400: "This user is not allowed to enroll in courses.",
                403: "You do not have permission to enroll in this course.",
                404: "The selected course could not be found.",
                409: "This user is already enrolled in the course.",
            });

            setError(message);
            return { success: false, data: null, message, status };
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

            const status = err.response?.status;

            const message = extractErrorMessage(/** @type {any} */(err), {
                403: "You do not have permission to update this enrollment.",
                404: "The selected enrollment could not be found.",
            });

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