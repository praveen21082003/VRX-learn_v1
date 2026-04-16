import { useState, useEffect } from "react";
import { getMediaUrl } from "@/services/media.service";

export default function useMedia(mediaId) {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!mediaId) return;

        const fetchMedia = async () => {
            try {
                setLoading(true);
                const res = await getMediaUrl(mediaId);
                setUrl(res); // presigned URL
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [mediaId]);

    return { url, loading, error };
}