import { useState, useCallback } from "react";
import { updateCourseInfo } from "@/services/Course.service";

export default function useUpdateCourseInfo() {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const updateCourseDetails = useCallback(async (courseId, payload) => {
        if (!courseId) {
            return {
                success: false,
                data: null,
                message: "Course ID is required",
            };
        }

        try {
            setUpdating(true);
            setError(null);

            const response = await updateCourseInfo(courseId, payload);

            return {
                success: true,
                data: response?.data || response,
                message: "Course details updated successfully",
            };
        } catch (err) {
            let message = "Failed to update course details";

            if (err.response?.status === 400) {
                message = "Please check the entered course details";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to update this course";
            }

            if (err.response?.status === 404) {
                message = "Course not found";
            }

            if (err.response?.status >= 500) {
                message = "Server error while updating the course";
            }

            setError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setUpdating(false);
        }
    }, []);

    return {
        updateCourseDetails,
        updating,
        error,
        setError,
    };
}