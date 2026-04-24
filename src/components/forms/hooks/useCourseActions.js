import { useCallback, useState } from "react";
import {
    createCourseService,
    updateCourseBasicInfoService,
    deleteCourseService,
} from "@/services/Course.service";

export const useCourseActions = () => {
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    // create course
    const createNewCourse = useCallback(async (payload) => {
        try {
            setCreating(true);
            setError(null);
            const res = await createCourseService(payload);
            return {
                success: true,
                data: res?.data || res,
                message: "Course created successfully",
            };
        } catch (err) {
            let message = "Unable to create course. Please try again.";
            if (err.response?.status === 400) message = "Please check the course details.";
            if (err.response?.status === 409) message = "A course with this title already exists.";
            if (err.response?.status === 403) message = "You do not have permission to create courses.";
            if (err.response?.status >= 500) message = "Server error while creating course.";
            setError(message);
            return { success: false, data: null, message };
        } finally {
            setCreating(false);
        }
    }, []);

    // update course
    const updateCourse = useCallback(async (courseId, payload) => {
        try {
            setUpdating(true);
            setError(null);
            const res = await updateCourseBasicInfoService(courseId, payload);
            return {
                success: true,
                data: res?.data || res,
                message: "Course updated successfully",
            };
        } catch (err) {
            let message = "Unable to update course. Please try again.";
            if (err.response?.status === 404) message = "Course not found.";
            if (err.response?.status === 403) message = "You do not have permission to update this course.";
            if (err.response?.status >= 500) message = "Server error while updating course.";
            setError(message);
            return { success: false, data: null, message };
        } finally {
            setUpdating(false);
        }
    }, []);

    // delete course
    const deleteCourse = useCallback(async (courseId) => {
        try {
            setDeleting(true);
            setError(null);
            const res = await deleteCourseService(courseId);
            return {
                success: true,
                data: res?.data || res,
                message: "Course deleted successfully",
            };
        } catch (err) {
            let message = "Unable to delete course. Please try again.";
            if (err.response?.status === 404) message = "Course not found.";
            if (err.response?.status === 403) message = "You do not have permission to delete this course.";
            if (err.response?.status === 409) message = "This course cannot be deleted right now.";
            if (err.response?.status >= 500) message = "Server error while deleting course.";
            setError(message);
            return { success: false, data: null, message };
        } finally {
            setDeleting(false);
        }
    }, []);

    return {
        createNewCourse,
        updateCourse,
        deleteCourse,
        creating,
        updating,
        deleting,
        error,
        setError,
    };
};