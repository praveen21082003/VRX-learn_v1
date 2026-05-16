import { useState, useCallback } from "react";
import { getLessonsByModuleId } from "../../../../../services/Lessons.service";

export default function useLessons() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cache, setCache] = useState({});

    const fetchLessons = useCallback(async (moduleId) => {
        if (!moduleId) {
            return {
                success: false,
                data: [],
                message: "Module ID is required",
            };
        }

        // return cached if exists
        if (cache[moduleId]) {
            setLessons(cache[moduleId]);
            return {
                success: true,
                data: cache[moduleId],
                message: "Lessons loaded from cache",
            };
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getLessonsByModuleId(moduleId);

            const data = response?.data || response || [];
            const lessonsList = Array.isArray(data) ? data : [];

            setLessons(lessonsList);
            setCache(prev => ({ ...prev, [moduleId]: lessonsList }));

            return {
                success: true,
                data: lessonsList,
                message: "Lessons loaded successfully",
            };
        } catch (err) {
            let message = "Failed to load lessons";

            if (err.response?.status === 404) message = "Lessons not found";
            if (err.response?.status === 403) message = "You do not have permission to view these lessons";
            if (err.response?.status >= 500) message = "Server error while loading lessons";

            setError(message);
            setLessons([]);

            return {
                success: false,
                data: [],
                message,
            };
        } finally {
            setLoading(false);
        }
    }, [cache]);


    // call this after create/rename/delete to force refetch
    const invalidateCache = useCallback((moduleId) => {
        setCache(prev => {
            const updated = { ...prev };
            delete updated[moduleId];
            return updated;
        });
    }, []);

    return {
        lessons,
        setLessons,
        loading,
        error,
        fetchLessons,
        invalidateCache,
    };
}