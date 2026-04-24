import { useState, useCallback, useRef, useEffect } from "react";
import { getTrainerCourseContent } from "@/services/CourseContent.service";

export default function useCourseContent(courseId) {
    const [courseContent, setCourseContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isFetchingRef = useRef(false);

    const fetchCourseContent = useCallback(async () => {
        console.log("starting");
        if (!courseId || isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            setLoading(true);
            setError(null);

            const response = await getTrainerCourseContent(courseId);
            const content = response?.data || response || null;
            setCourseContent(content);

            return { success: true, data: content };
        } catch (err) {
            let message = "Failed to load course content";
            if (err.response?.status === 404) message = "Course content not found";
            if (err.response?.status === 403) message = "You do not have permission to view this course";
            if (err.response?.status >= 500) message = "Server error while loading course content";

            setError(message);
            return { success: false, data: null, message };
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseContent();
    }, [courseId]); 

    return {
        courseContent,
        setCourseContent,
        loading,
        error,
        refreshCourseContent: fetchCourseContent,
    };
}