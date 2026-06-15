import { useState, useEffect, useCallback } from "react";
import { extractErrorMessage } from "@/utils/errorUtils";

export default function useViewUrl(id, fetchFn, customErrors = {}) {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchUrl = useCallback(async () => {
        if (!id) {
            setUrl(null);
            setError("");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await fetchFn(id);

            setUrl(res);
        } catch (err) {
            setUrl(null);

            setError(
                extractErrorMessage(err, customErrors)
            );
        } finally {
            setLoading(false);
        }
    }, [id, fetchFn]);

    useEffect(() => {
        fetchUrl();
    }, [fetchUrl]);

    return {
        url,
        loading,
        error,
        refetch: fetchUrl,
    };
}