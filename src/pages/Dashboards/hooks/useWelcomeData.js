import { useState, useEffect } from "react";
import { getCurrentCourse } from "@/services/Dashboard.service";

export function useWelcomeData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Prevents memory leaks if user navigates away
        let isMounted = true;

        const fetchWelcomeData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getCurrentCourse();

                if (isMounted) {
                    setData(response);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || "Failed to load course details");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchWelcomeData();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        course: data,
        loading,
        error,
    };
}