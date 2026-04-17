import { useState, useEffect, useCallback, useRef } from "react";
import {
    getAdminKPIs,
    getTrainerKPIs,
} from "@/services/Dashboard.service";

export const useDashboardKPIs = (role) => {
    const [kpis, setKpis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false);

    const fetchKPIs = useCallback(async () => {
        if (!role) return;

        try {
            setLoading(true);
            setError(null);

            let response = null;

            if (role === "admin") {
                response = await getAdminKPIs();
            } else if (role === "trainer") {
                response = await getTrainerKPIs();
            }

            setKpis(response?.data || response);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch dashboard data"
            );
        } finally {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        if (!role || hasFetched.current) return;

        hasFetched.current = true;
        fetchKPIs();
    }, [role, fetchKPIs]);

    useEffect(() => {
        hasFetched.current = false;
    }, [role]);

    return {
        kpis,
        loading,
        error,
        refresh: fetchKPIs,
        setKpis,
    };
};