import { useState, useCallback, useRef } from "react";
import { getEnrollments } from "../../../services/ListView.service";

export const useEnrollmentsData = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const isFetchingRef = useRef(false);

    const fetchEnrollments = useCallback(async (params = {}) => {
        if (isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            setLoading(true);
            setError(null);

            const res = await getEnrollments(params);

            setEnrollments(res?.data || []);
            setTotal(res?.totalItems || 0);

            return res?.data || [];
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch enrollments"
            );

            setEnrollments([]);
            setTotal(0);

            return [];
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, []);

    return {
        enrollments,
        setEnrollments,
        loading,
        error,
        total,
        refreshEnrollments: fetchEnrollments,
    };
};