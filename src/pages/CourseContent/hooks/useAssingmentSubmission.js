import { useState } from "react";

import { createAssignmentSubmission, updateAttachmentStatus } from '@/services/AssignmentSubmission.service';


import { UploadMediaToS3 } from "@/services/UploadMediaToS3.service";


export function useAssignmentSubmission() {
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
                throw new Error("Invalid upload response: Missing URL or Media ID");
            }

            if (file) {
                try {
                    const uploadRes = await UploadMediaToS3(url, file, (percent, loaded) => {
                        setUploadProgress(percent);
                        setLoadedData(loaded);
                    });


                    if (uploadRes.status !== 200) {
                        throw new Error("File upload failed");
                    }

                    const mediaRes = await updateAttachmentStatus(id);
                    const mediaData = mediaRes?.data || mediaRes;

                    setMediaStatus(mediaData?.status);

                } catch (uploadError) {
                    console.error(uploadError)
                    setError(uploadError?.message || "File upload failed");
                    throw uploadError;
                }
            }

            return {
                success: true,
                lessonId: response?.lessonId,
                mediaId: response?.mediaId,
            };

        } catch (err) {
            console.log(err)
            const status = err?.response?.status;

            const message = !err?.response
                ? "Network error. Check your connection"
                : getCustomErrorMessage(status);

            setError(message);
            throw new Error(message);

        } finally {
            setLoading(false);
            setMediaStatus(null);
        }
    };

    return {
        submitAssignment,
        loading,
        error,
        uploadProgress,
        mediaStatus,
        loadedData
    };
}