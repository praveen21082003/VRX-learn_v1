import { useCallback, useState } from "react";
import {
    createModule,
    updateModuleById,
} from "../../../services/Modules.service";

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
            let message = "Failed to create module";

            if (err.response?.status === 400) {
                message = "Please check the entered module details";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to create modules";
            }

            if (err.response?.status === 404) {
                message = "Course not found";
            }

            if (err.response?.status >= 500) {
                message = "Server error while creating module";
            }

            setError(message);

            return {
                success: false,
                data: null,
                message,
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
            let message = "Failed to update module";

            if (err.response?.status === 400) {
                message = "Please check the entered module details";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to update this module";
            }

            if (err.response?.status === 404) {
                message = "Module not found";
            }

            if (err.response?.status >= 500) {
                message = "Server error while updating module";
            }

            setError(message);

            return {
                success: false,
                data: null,
                message,
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