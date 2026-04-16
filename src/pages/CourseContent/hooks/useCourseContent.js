import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getTraineeCourseContent } from "@/services/CourseContent.service";

export const useCourseContent = (courseId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false);

    const fetchContent = useCallback(async () => {
        if (!courseId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await getTraineeCourseContent(courseId);
            console.log("Fetching course content");

            setData(response);
        } catch (err) {
            setError(
                err.response?.data?.message || "Error loading content"
            );
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        if (hasFetched.current || !courseId) return;

        hasFetched.current = true;
        fetchContent();
    }, [courseId, fetchContent]);

    const allLessons = useMemo(() => {
        return (data?.modules || []).flatMap(
            (module) => module.lessons || []
        );
    }, [data]);

    return {
        course: data?.course || null,
        modules: data?.modules || [],
        allLessons: (data?.modules || []).flatMap(
            (module) => module.lessons || []
        ),
        loading,
        error,
        refetch: fetchContent,
    };
};