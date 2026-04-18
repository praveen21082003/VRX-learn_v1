import { useState, useCallback, useRef } from "react";
import { getUsers } from "@/services/ListView.service";

export const useUsersData = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const isFetchingRef = useRef(false);

    const fetchUsers = useCallback(async (params = {}) => {
        if (isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            setLoading(true);
            setError(null);

            const res = await getUsers(params);

            setUsers(res?.data || []);
            setTotal(res?.totalItems || 0);

            return res?.data || [];
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch users"
            );

            setUsers([]);
            setTotal(0);

            return [];
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, []);

    return {
        users,
        setUsers,
        loading,
        error,
        total,
        refreshUsers: fetchUsers,
    };
};