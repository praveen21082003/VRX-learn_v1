import { useCallback, useState } from "react";

import { createLesson, updateLesson, deleteLesson, updateAttachmentStatus } from "@/services/Lessons.service";
import { UploadMediaToS3 } from "@/services/UploadMediaToS3.service";
import { updateMediaStatus } from "@/services/Media.service";
import { extractErrorMessage } from '@/utils/errorUtils';
import { getUploadErrorMessage } from '@/utils/S3errorUtils'

export default function useLessonActions() {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
            // console.log("createLesson", response);

            const lessonId = response?.data?.id;
            const uploadUrl = response?.media?.url;
            const mediaId = response?.media?.id;

            if (file) {
                if (!uploadUrl || !mediaId) {
                    return {
                        success: false,
                        data: null,
                        message: "Upload URL or Media ID missing",
                    };
                }

                try {

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

                } catch (uploadErr) {
                    const message = getUploadErrorMessage(uploadErr);

                    setLessonError(message);

                    return {
                        success: false,
                        data: null,
                        message,
                    };
                }

                const AttachmentStatus = await updateAttachmentStatus(lessonId);

                setMediaStatus(AttachmentStatus?.status || null);
            }

            return {
                success: true,
                data: response,
                lessonId,
                mediaId,
                message: "Lesson created successfully",
            };
        } catch (err) {
            console.log(err);

            const status = err.response?.status;
            const message = extractErrorMessage(/** @type {any} */(err), {
                403: "You do not have permission to create lessons.",
                404: "Module not found.",
                409: "A lesson with this title already exists in this module.",
                422: "Please check the entered details.",
            });

            setLessonError(message);

            return {
                success: false,
                data: null,
                message,
                status,
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

            const status = err.response?.status;
            const message = extractErrorMessage(/** @type {any} */(err), {
                403: "You do not have permission to update this lesson.",
                404: "Lesson not found.",
                409: "A lesson with this title already exists in this module.",
                422: "Please check the entered details.",
            });

            setLessonError(message);

            return {
                success: false,
                data: null,
                message,
                status,
            };
        } finally {
            setIsUpdating(false);
        }
    }, []);


    // ---------------------- Delete Lesson -------------------------
    const deleteLessonAction = useCallback(async (lessonId) => {
        if (!lessonId) {
            return {
                success: false,
                data: null,
                message: "Lesson ID is required",
            };
        }

        setLessonError(null);
        setIsDeleting(true);

        try {
            await deleteLesson(lessonId);

            return {
                success: true,
                data: null,
                message: "Lesson deleted successfully",
            };
        } catch (err) {
            const status = err.response?.status;
            const message = extractErrorMessage(/** @type {any} */(err), {
                403: "You do not have permission to delete this lesson.",
                404: "Lesson not found.",
                422: "Please check the entered details.",
            });

            setLessonError(message);

            return {
                success: false,
                data: null,
                message,
                status,
            };
        } finally {
            setIsDeleting(false);
        }
    }, []);

    return {
        createLessonAction,
        updateLessonAction,
        deleteLessonAction,

        isCreating,
        isUpdating,
        isDeleting,

        lessonError,
        setLessonError,

        uploadProgress,
        loadedData,
        mediaStatus,
    };
}