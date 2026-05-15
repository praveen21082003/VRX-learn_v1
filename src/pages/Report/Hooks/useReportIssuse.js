import { useCallback, useState } from "react";

import {
    updateIssues,
    getIssues,
} from "@/services/Issues.service";

import { extractErrorMessage } from "@/utils/errorUtils";

export const useReportIssues = () => {

    // update states
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    // get states
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [issue, setIssue] = useState(null);

    /**
     * UPDATE ISSUE
     */
    const updateIssue = useCallback(
        async (issueId, params = {}) => {
            try {
                setUpdating(true);
                setUpdateError(null);

                const res = await updateIssues(issueId, params); 

                return {
                    success: true,
                    data: res?.data || res,
                    message: "Issue updated successfully",
                };

            } catch (err) {

                const status = err?.response?.status;

                const message = extractErrorMessage(err, {
                    400: "Invalid issue update request.",
                    403: "You do not have permission to update this issue.",
                    404: "Issue not found.",
                    409: "Conflict occurred while updating issue.",
                    422: "Please check the entered details.",
                });

                setUpdateError(message);

                return {
                    success: false,
                    data: null,
                    message,
                    status,
                };

            } finally {
                setUpdating(false);
            }
        },
        []
    );

    /**
     * GET ISSUE
     */
    const getIssue = useCallback(async (issueId) => {
        try {
            setLoading(true);
            setFetchError(null);

            const res = await getIssues(issueId);

            setIssue(res|| null);

            return {
                success: true,
                data: res?.data || res,
                message: "Issue fetched successfully",
            };

        } catch (err) {

            const status = err?.response?.status;

            const message = extractErrorMessage(err, {
                403: "You do not have permission to view this issue.",
                404: "Issue not found.",
            });

            setFetchError(message);

            return {
                success: false,
                data: null,
                message,
                status,
            };

        } finally {
            setLoading(false);
        }
    }, []);

    return {

        // update
        updateIssue,
        updating,
        updateError,
        setUpdateError,

        // get
        getIssue,
        loading,
        fetchError,
        setFetchError,
        issue,
        setIssue,
    };
};