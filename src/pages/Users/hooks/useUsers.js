import { useCallback, useState } from "react";
import {
    createUsers,
    deleteUserService,
} from "@/services/User.service";

export const useUser = () => {
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const createNewUser = useCallback(async (payload) => {
        try {
            setCreating(true);
            setError(null);

            const res = await createUsers(payload);

            return res?.data || res;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Failed to create user";

            setError(message);
            throw new Error(message);
        } finally {
            setCreating(false);
        }
    }, []);

    const deleteUser = useCallback(async (userId) => {
        try {
            setDeleting(true);
            setError(null);

            const res = await deleteUserService(userId);

            return res?.data || res;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.detail ||
                err.message ||
                "User not deleted. Something went wrong";

            setError(message);
            throw new Error(message);
        } finally {
            setDeleting(false);
        }
    }, []);

    return {
        createNewUser,
        deleteUser,

        creating,
        deleting,

        error,
        setError,
    };
};