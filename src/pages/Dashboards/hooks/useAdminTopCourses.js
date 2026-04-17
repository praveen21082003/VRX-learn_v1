import { useState, useEffect, useCallback, useRef } from "react";
import { getAdminTopCourses } from "@/services/dashboard.service";

export const useAdminTopCourses = () => {
    const [topCourses, setTopCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false);

    const fetchTopCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAdminTopCourses();

            setTopCourses(response?.data || response || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load top courses"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasFetched.current) return;

        hasFetched.current = true;
        fetchTopCourses();
    }, [fetchTopCourses]);

    return {
        topCourses,
        loading,
        error,
        refresh: fetchTopCourses,
        setTopCourses,
    };
};