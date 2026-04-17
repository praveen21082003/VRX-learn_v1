import { useState, useEffect, useCallback, useRef } from "react";
import { getTrainerAssignedCourses } from "@/services/Dashboard.service";

export const useTrainerAssignedCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false);

    const fetchAssignedCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getTrainerAssignedCourses();

            setCourses(response?.data || response || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load assigned courses"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasFetched.current) return;

        hasFetched.current = true;
        fetchAssignedCourses();
    }, [fetchAssignedCourses]);

    return {
        courses,
        loading,
        error,
        refresh: fetchAssignedCourses,
    };
};