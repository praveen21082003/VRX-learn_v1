import { useState, useCallback, useEffect } from "react";
import { getTraineesRoster } from "@/services/ListView.service.js";

export default function useTraineeRosterData() {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const fetchRoster = useCallback(async (courseId, params = {}) => {
        if (!courseId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getTraineesRoster(courseId, params);

            const data = response?.data || response;

            setRoster(data || []);
            setTotal(response?.totalItems || 0);

            return {
                success: true,
                data,
                message: "Trainee roster fetched successfully",
            };
        } catch (err) {
            let message = "Failed to fetch trainee roster";

            if (err.response?.status === 400) {
                message = "Invalid request for trainee roster";
            } else if (err.response?.status === 403) {
                message = "You do not have permission to view trainees";
            } else if (err.response?.status === 404) {
                message = "No trainees found";
            } else if (err.response?.status >= 500) {
                message = "Server error while fetching trainees";
            }

            setError(message);
            setTotal(0);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setLoading(false);
        }
    }, []);


    return {
        roster,
        setRoster,

        loading,
        error,
        setError,

        total,

        fetchRoster,
    };
}