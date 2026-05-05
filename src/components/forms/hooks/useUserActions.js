import { useCallback, useState } from "react";
import {
    createUsers,
    deleteUserService,
} from "@/services/User.service";

import { extractErrorMessage } from '@/utils/errorUtils';



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

            const status = err.response?.status;

            const message = extractErrorMessage(/** @type {any} */(err), {
                400: "Password and confirm password do not match.",
                403: "You do not have permission to create users.",
                409: "A user with this email already exists.",
                422: "Please check the entered details.",
            });

            setError(message);

            return {
                success: false,
                data: null,
                message,
                status
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
            const status = err.response?.status;
            const message = extractErrorMessage(/** @type {any} */(err), {
                403: "You do not have permission to delete this user.",
                422: "Unable to delete user. Please try again.",
            });
            setError(message);
            return { success: false, data: null, message, status };
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