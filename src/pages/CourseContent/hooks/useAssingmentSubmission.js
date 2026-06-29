import { useState, useRef, useCallback } from "react";

import { createAssignmentSubmission, updateAttachmentStatus } from '@/services/AssignmentSubmission.service';


import { UploadMediaToS3 } from "@/services/UploadMediaToS3.service";


export function useAssignmentSubmission() {

    const uploadControllerRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [mediaStatus, setMediaStatus] = useState(null);
    const [loadedData, setLoadedData] = useState(0);

    const getCustomErrorMessage = (status) => {
        const map = {
            400: "Invalid submission data.",
            401: "Session expired. Please login again.",
            403: "You are not allowed to submit this assignment.",
            404: "Assignment not found.",
            413: "File too large.",
            500: "Server error. Try again later."
        };

        return map[status] || "Failed to submit assignment.";
    };

    const submitAssignment = async (payload, file = null) => {
        setLoading(true);
        setError(null);


        setUploadProgress(0);
        setMediaStatus(null);
        setLoadedData(0);

        try {
            const response = await createAssignmentSubmission(payload);
            // const { media: { url, id } = {} } = response || {};
            const id = response?.data?.id
            const url = response?.media?.url

            if (!url || !id) {
                return {
                    success: false,
                    data: null,
                    message: "Invalid upload response: Missing URL or Media ID"
                }
            }

            if (file) {
                try {

                    uploadControllerRef.current = new AbortController();

                    const uploadRes = await UploadMediaToS3(
                        url,
                        file,
                        (percent, loaded) => {
                            setUploadProgress(percent);
                            setLoadedData(loaded);
                        },
                        uploadControllerRef.current.signal
                    );


                    if (uploadRes.status !== 200) {
                        // throw new Error("File upload failed");

                        uploadControllerRef.current = null;

                        return {
                            success: false,
                            data: null,
                            message: "File upload failed",
                        }
                    }

                    const mediaRes = await updateAttachmentStatus(id);
                    const mediaData = mediaRes?.data || mediaRes;

                    setMediaStatus(mediaData?.status);

                } catch (uploadError) {
                    console.error(uploadError);

                    if (uploadErr.code === "ERR_CANCELED") {
                        uploadControllerRef.current = null;

                        return {
                            success: false,
                            data: null,
                            message: "Upload cancelled",
                            cancelled: true,
                        };
                    }

                    const message = uploadError?.message || "File upload failed";
                    const status = uploadError?.response?.status;



                    setError(message);

                    // throw uploadError;
                    return {
                        success: false,
                        data: null,
                        message,
                        status
                    }
                }
            }

            return {
                success: true,
                data: response,
                message: "Assignment submitted successfully.",
            };

        } catch (err) {
            console.log(err)
            const status = err?.response?.status;

            const message = !err?.response
                ? "Network error. Check your connection"
                : getCustomErrorMessage(status);

            setError(message);

            return {
                success: false,
                data: null,
                message,
                status,
            };

        } finally {
            setLoading(false);
            setMediaStatus(null);
        }
    };

    const uploadCancel = useCallback(() => {
        uploadControllerRef.current.abort();
    }, [])

    return {
        submitAssignment,
        uploadCancel,

        loading,
        error,
        uploadProgress,
        mediaStatus,
        loadedData
    };
}