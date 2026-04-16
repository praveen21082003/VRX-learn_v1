import { useState, useEffect } from "react";
import { getEnrolledCourses, getTopCourses } from "@/services/Dashboard.service";

export const useDashboardCourses = (topCount = 3) => {
    const [data, setData] = useState({
        enrolled: [],
        top: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAllDashboardData = async () => {
            try {
                setLoading(true);

                const [enrolledRes, topRes] = await Promise.all([
                    getEnrolledCourses(),
                    getTopCourses(topCount)
                ]);

                if (isMounted) {
                    setData({
                        enrolled: enrolledRes,
                        top: topRes
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || "Failed to load dashboard courses");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAllDashboardData();

        return () => {
            isMounted = false;
        };
    }, [topCount]);

    return {
        enrolledCourses: data.enrolled,
        topCourses: data.top,
        loading,
        error
    };
};