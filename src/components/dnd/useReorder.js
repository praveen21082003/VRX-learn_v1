import { useCallback, useState } from "react";
import { reorderModules as reorderModulesService } from "@/services/Modules.service";
import { reorderLessons as reorderLessonsService } from "@/services/Lessons.service";

export const useReorder = () => {
    const [error, setError] = useState(null);
    const [isUpdatingModules, setIsUpdatingModules] = useState(false);
    const [isUpdatingLessons, setIsUpdatingLessons] = useState(false);

    const reorderModules = useCallback(async (moduleId, params = {}) => {
        if (!moduleId) {
            return {
                success: false,
                data: null,
                message: "Module ID is required",
            };
        }

        try {
            setIsUpdatingModules(true);
            setError(null);

            const response = await reorderModulesService(moduleId, params);

            return {
                success: true,
                data: response?.data || response,
                message: "Modules reordered successfully",
            };
        } catch (err) {
            let message = "Failed to reorder modules";

            if (err.response?.status === 400) {
                message = "Invalid module reorder request";
            }

            if (err.response?.status === 404) {
                message = "Module not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to reorder modules";
            }

            if (err.response?.status >= 500) {
                message = "Server error while reordering modules";
            }

            setError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setIsUpdatingModules(false);
        }
    }, []);

    const reorderLessons = useCallback(async (lessonId, params = {}) => {
        if (!lessonId) {
            return {
                success: false,
                data: null,
                message: "Lesson ID is required",
            };
        }

        try {
            setIsUpdatingLessons(true);
            setError(null);

            const response = await reorderLessonsService(lessonId, params);

            return {
                success: true,
                data: response?.data || response,
                message: "Lessons reordered successfully",
            };
        } catch (err) {
            let message = "Failed to reorder lessons";

            if (err.response?.status === 400) {
                message = "Invalid lesson reorder request";
            }

            if (err.response?.status === 404) {
                message = "Lesson not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to reorder lessons";
            }

            if (err.response?.status >= 500) {
                message = "Server error while reordering lessons";
            }

            setError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setIsUpdatingLessons(false);
        }
    }, []);

    return {
        error,
        setError,

        isUpdatingModules,
        isUpdatingLessons,

        reorderModules,
        reorderLessons,
    };
};