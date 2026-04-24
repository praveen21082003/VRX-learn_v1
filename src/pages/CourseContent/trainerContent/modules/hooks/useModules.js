import { useCallback, useState } from "react";
import {
    getModuleById,
    updateModuleById,
    deleteModuleById,
} from "@/services/Modules.service";

export default function useModules() {
    const [moduleData, setModuleData] = useState(null);

    const [moduleLoading, setModuleLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [moduleError, setModuleError] = useState(null);


    // get modules
    const fetchModule = useCallback(async (moduleId) => {
        if (!moduleId) {
            return {
                success: false,
                data: null,
                message: "Module ID is required",
            };
        }

        try {
            setModuleLoading(true);
            setModuleError(null);

            const response = await getModuleById(moduleId);
            const data = response?.data || response;

            setModuleData(data);

            return {
                success: true,
                data,
                message: "Module loaded successfully",
            };
        } catch (err) {
            let message = "Failed to load module";

            if (err.response?.status === 404) {
                message = "Module not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to view this module";
            }

            if (err.response?.status >= 500) {
                message = "Server error while loading module";
            }

            setModuleError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setModuleLoading(false);
        }
    }, []);


    // update module
    const updateModule = useCallback(async (moduleId, payload) => {
        if (!moduleId) {
            return {
                success: false,
                data: null,
                message: "Module ID is required",
            };
        }

        try {
            setIsUpdating(true);
            setModuleError(null);

            const response = await updateModuleById(moduleId, payload);
            const updatedModule = response?.data || response;

            setModuleData(updatedModule);

            return {
                success: true,
                data: updatedModule,
                message: "Module updated successfully",
            };
        } catch (err) {
            let message = "Failed to update module";

            if (err.response?.status === 400) {
                message = "Please check the entered module details";
            }

            if (err.response?.status === 404) {
                message = "Module not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to update this module";
            }

            if (err.response?.status >= 500) {
                message = "Server error while updating module";
            }

            setModuleError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setIsUpdating(false);
        }
    }, []);


    // delete module
    const deleteModule = useCallback(async (moduleId) => {
        if (!moduleId) {
            return {
                success: false,
                data: null,
                message: "Module ID is required",
            };
        }

        try {
            setIsDeleting(true);
            setModuleError(null);

            const response = await deleteModuleById(moduleId);

            return {
                success: true,
                data: response?.data || response,
                message: "Module deleted successfully",
            };
        } catch (err) {
            let message = "Failed to delete module";

            if (err.response?.status === 404) {
                message = "Module not found";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to delete this module";
            }

            if (err.response?.status >= 500) {
                message = "Server error while deleting module";
            }

            setModuleError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setIsDeleting(false);
        }
    }, []);

    return {
        moduleData,
        setModuleData,


        moduleLoading,
        isUpdating,
        isDeleting,

        moduleError,
        setModuleError,

        fetchModule,
        updateModule,
        deleteModule,

    };
}