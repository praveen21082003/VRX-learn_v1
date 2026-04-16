import { useState, useEffect } from "react";
import { getCourseTraineeOverview, getCourseTrainerOverview } from "@/services/CourseOverview.service";

export const useCourseOverview = (courseId, role) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) return;

        const fetchOverview = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = role === "trainer" || role === "admin"
                    ? await getCourseTrainerOverview(courseId)
                    : await getCourseTraineeOverview(courseId);

                setData(response);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, [courseId, role]);

    return { data, loading, error };
};