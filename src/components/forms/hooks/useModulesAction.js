import { useCallback, useState } from "react";
import {
    createModule,
    updateModuleById,
} from "../../../services/Modules.service";
import { extractErrorMessage } from '@/utils/errorUtils';

export function useModulesAction() {
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const createNewModule = useCallback(async (courseId, payload) => {
        if (!courseId) {
            return {
                success: false,
                data: null,
                message: "Course ID is required",
            };
        }

        try {
            setCreating(true);
            setError(null);

            const response = await createModule(courseId, payload);
            const data = response?.data || response;

            return {
                success: true,
                data,
                message: "Module created successfully",
            };
        } catch (err) {
            const status = err.response?.status;
            const message = extractErrorMessage(/** @type {any} */(err), {
                403: "You do not have permission to create modules.",
                404: "Course not found.",
                409: "A module with this title already exists in this course.",
                422: "Please check the entered details.",
            });

            setError(message);

            return {
                success: false,
                data: null,
                message,
                status,
            };
        } finally {
            setCreating(false);
        }
    }, []);

    const updateModule = useCallback(async (moduleId, payload) => {
        if (!moduleId) {
            return {
                success: false,
                data: null,
                message: "Module ID is required",
            };
        }

        try {
            setUpdating(true);
            setError(null);

            const response = await updateModuleById(moduleId, payload);
            const data = response?.data || response;

            return {
                success: true,
                data,
                message: "Module updated successfully",
            };
        } catch (err) {
            const status = err.response?.status;
            const message = extractErrorMessage(/** @type {any} */(err), {
                403: "You do not have permission to update this module.",
                404: "Module not found.",
                409: "A module with this title already exists in this course.",
                422: "Please check the entered details.",
            });
            setError(message);

            return {
                success: false,
                data: null,
                message,
                status,
            };
        } finally {
            setUpdating(false);
        }
    }, []);

    return {
        createNewModule,
        updateModule,

        creating,
        updating,

        error,
        setError,
    };
}