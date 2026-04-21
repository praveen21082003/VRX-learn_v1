import { useCallback, useState } from "react";

import { createLesson, updateLesson } from "@/services/Lessons.service";
import { UploadMediaToS3 } from "@/services/UploadMediaToS3.service";
import { updateMediaStatus } from "@/services/Media.service";

export default function useLessonActions() {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [lessonError, setLessonError] = useState(null);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [loadedData, setLoadedData] = useState(0);
    const [mediaStatus, setMediaStatus] = useState(null);

    const createLessonAction = useCallback(async (payload, file = null) => {
        setIsCreating(true);
        setLessonError(null);
        setUploadProgress(0);
        setLoadedData(0);
        setMediaStatus(null);

        try {
            const response = await createLesson(payload);

            const lessonId = response?.lessonId;
            const uploadUrl = response?.uploadUrl;
            const mediaId = response?.mediaId;

            if (file) {
                if (!uploadUrl || !mediaId) {
                    return {
                        success: false,
                        data: null,
                        message: "Upload URL or Media ID missing",
                    };
                }

                const uploadResponse = await UploadMediaToS3(
                    uploadUrl,
                    file,
                    (percent, loaded) => {
                        setUploadProgress(percent);
                        setLoadedData(loaded);
                    }
                );

                if (uploadResponse?.status !== 200) {
                    return {
                        success: false,
                        data: null,
                        message: "Failed to upload lesson media",
                    };
                }

                const mediaResponse = await updateMediaStatus(mediaId);
                const mediaData = mediaResponse?.data || mediaResponse;

                setMediaStatus(mediaData?.status || null);
            }

            return {
                success: true,
                data: response,
                lessonId,
                mediaId,
                message: "Lesson created successfully",
            };
        } catch (err) {
            let message = "Failed to create lesson";

            if (err.response?.status === 400) {
                message = "Please check the entered lesson details";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to create lessons";
            }

            if (err.response?.status === 404) {
                message = "Module not found";
            }

            if (err.response?.status >= 500) {
                message = "Server error while creating the lesson";
            }

            setLessonError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setIsCreating(false);
        }
    }, []);

    const updateLessonAction = useCallback(async (lessonId, payload) => {
        if (!lessonId) {
            return {
                success: false,
                data: null,
                message: "Lesson ID is required",
            };
        }

        setIsUpdating(true);
        setLessonError(null);

        try {
            const response = await updateLesson(lessonId, payload);

            return {
                success: true,
                data: response?.data || response,
                message: "Lesson updated successfully",
            };
        } catch (err) {
            let message = "Failed to update lesson";

            if (err.response?.status === 400) {
                message = "Please check the entered lesson details";
            }

            if (err.response?.status === 403) {
                message = "You do not have permission to update this lesson";
            }

            if (err.response?.status === 404) {
                message = "Lesson not found";
            }

            if (err.response?.status >= 500) {
                message = "Server error while updating the lesson";
            }

            setLessonError(message);

            return {
                success: false,
                data: null,
                message,
            };
        } finally {
            setIsUpdating(false);
        }
    }, []);

    return {
        createLessonAction,
        updateLessonAction,

        isCreating,
        isUpdating,

        lessonError,
        setLessonError,

        uploadProgress,
        loadedData,
        mediaStatus,
    };
}