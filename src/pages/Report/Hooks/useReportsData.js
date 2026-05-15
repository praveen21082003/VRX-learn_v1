import { useState, useCallback, useRef } from "react";
import { getIssues } from "../../../services/ListView.service";

export const useReportsData = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const isFetchingRef = useRef(false);

    const fetchReports = useCallback(async (params = {}) => {
        if (isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            setLoading(true);
            setError(null);

            const res = await getIssues(params);
            console.log(res)
            setReports(res?.data || []);
            setTotal(res?.totalItems || 0);

            return res?.data || [];
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Failed to fetch reports"
            );

            setReports([]);
            setTotal(0);

            return [];
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, []);

    return {
        reports,
        setReports,
        loading,
        error,
        total,
        refreshReports: fetchReports,
    };
};