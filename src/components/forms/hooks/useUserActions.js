import { useCallback, useState } from "react";
import {
    createUsers,
    deleteUserService,
} from "@/services/User.service";


export const useUserActions = () => {
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);


    //   create user
    const createNewUser = useCallback(async (payload) => {
        try {
            setCreating(true);
            setError(null);

            const res = await createUsers(payload);

            return {
                success: true,
                data: res?.data || res,
                message: "User created successfully",
            };
        } catch (err) {
            let message = "Unable to create user. Please try again.";

            if (err.response?.status === 400) {
                message = "Please check the entered user details.";
            }

            if (err.response?.status === 409) {
                message = "A user with this email already exists.";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to create users.";
            }

            if (err.response?.status >= 500) {
                message = "Server error while creating user.";
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


    // delete user

    const deleteUser = useCallback(async (userId) => {
        try {
            setDeleting(true);
            setError(null);

            const res = await deleteUserService(userId);

            return {
                success: true,
                data: res?.data || res,
                message: "User deleted successfully",
            };
        } catch (err) {
            let message = "Unable to delete user. Please try again.";

            if (err.response?.status === 404) {
                message = "User not found.";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to delete this user.";
            }

            if (err.response?.status === 409) {
                message = "This user cannot be deleted right now.";
            }

            if (err.response?.status >= 500) {
                message = "Server error while deleting user.";
            }

            setError(message);

            return {
                success: false,
                data: null,
                message,
            };
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