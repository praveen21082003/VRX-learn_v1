import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getTraineeCourseContent } from "@/services/CourseContent.service";

import { useErrorNavigation } from '@/pages/Errors/hook/useErrorNavigation';

export const useCourseContent = (courseId) => {

    const navigateError = useErrorNavigation();

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

            setData(response);
        } catch (err) {
            setError(
                err.response?.data?.message || "Error loading content"
            );

            const status = err.response?.status;

            if (status === 403 || status === 404 || status >= 500) {
                navigateError(status);
                return;
            }
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