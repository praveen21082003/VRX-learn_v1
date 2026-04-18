import { useState, useCallback, useRef } from "react";
import { getCourses } from "../../../services/ListView.service";

export const useCourseData = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const isFetchingRef = useRef(false);

    const fetchCourses = useCallback(async (params = {}) => {
        if (isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            setLoading(true);
            setError(null);

            const res = await getCourses(params);

            setCourses(res?.data || []);
            setTotal(res?.totalItems || 0);

            return res?.data || [];
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch courses"
            );

            setCourses([]);
            setTotal(0);

            return [];
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, []);

    return {
        courses,
        setCourses,
        loading,
        error,
        total,
        refreshCourses: fetchCourses,
    };
};