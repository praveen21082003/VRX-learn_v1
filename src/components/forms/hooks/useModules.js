import { getModules } from '@services/ListView.service'
import { extractErrorMessage } from '@/utils/errorUtils';
import { useCallback, useState } from 'react'

// Custom, hook-specific overrides for extractErrorMessage's generic fallbacks.
// Add/adjust as needed for module-fetching specific cases.
const MODULE_ERROR_MESSAGES = {
    404: "No modules found for this course.",
    403: "You do not have access to the modules for this course.",
};

export const useModule = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchModules = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getModules(courseId);
            const data = response?.data ?? response;

            setModules(data);

            return {
                status: true,
                data,
            };
        } catch (err) {
            const message = extractErrorMessage(err, MODULE_ERROR_MESSAGES);
            console.log(err);
            setError(message);

            return {
                status: false,
                data: null,
            };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        modules,
        loading,
        error,
        fetchModules,
    };
};