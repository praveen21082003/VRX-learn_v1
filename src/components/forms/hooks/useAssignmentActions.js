import { useState, useCallback } from "react";
import {
    createAssignment as createAssignmentService,
    updateAssignment as updateAssignmentService,
} from "@/services/Assignments.service";
import { UploadMediaToS3 } from "@/services/UploadMediaToS3.service";
import { updateMediaStatus } from "@/services/Media.service";

export default function useAssignmentActions() {
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const [mediaStatus, setMediaStatus] = useState(null);

    const [error, setError] = useState(null);

    const createAssignment = useCallback(async (assignmentData, file = null) => {
        try {
            setCreating(true);
            setError(null);
            setUploadProgress(0);
            setUploadedBytes(0);
            setMediaStatus(null);

            // build payload — fileMetadata optional
            const payload = {
                assignment: {
                    title: assignmentData.title,
                    instructions: assignmentData.instructions,
                    courseId: assignmentData.courseId,
                    dueDate: assignmentData.dueDate,
                    maxScore: assignmentData.maxScore ?? 5,
                    numberOfAttempts: assignmentData.numberOfAttempts ?? 1,
                },
                // ...(file && {
                //     fileMetadata: {
                //         filename: file.name,
                //         content_type: file.type,
                //         size: file.size,
                //     }
                // })
                fileMetadata: file ? {
                    filename: file.name,
                    content_type: file.type,
                    size: file.size,
                } : null
            };

            console.log(payload)

            const response = await createAssignmentService(payload);
            // console.log("create step - 1", response);
            const data = response?.data || response;

            const uploadUrl = data?.media?.uploadUrl;
            const mediaId = data?.media?.mediaId;

            // upload to S3 only if file provided and urls returned
            if (file && uploadUrl && mediaId) {
                const uploadResponse = await UploadMediaToS3(
                    uploadUrl,
                    file,
                    (percent, loaded) => {
                        setUploadProgress(percent);
                        setUploadedBytes(loaded);
                    }
                );
                console.log("uploading step -2 ", uploadResponse)


                if (uploadResponse?.status !== 200) {
                    return {
                        success: false,
                        partialSuccess: true, // assignment created but file failed
                        data,
                        message: "Assignment created but file upload failed. Please try uploading again.",
                    };
                }

                const mediaResponse = await updateMediaStatus(mediaId);
                console.log("media response step-3 ", mediaResponse);
                const mediaData = mediaResponse?.data || mediaResponse;
                setMediaStatus(mediaData?.status || "completed");
            }

            return {
                success: true,
                data,
                message: "Assignment created successfully",
            };

        } catch (err) {
            console.log(err)
            let message = "Failed to create assignment";
            if (err.response?.status === 400) message = "Please check the entered assignment details";
            if (err.response?.status === 403) message = "You do not have permission to create assignments";
            if (err.response?.status === 404) message = "Course not found";
            if (err.response?.status >= 500) message = "Server error while creating assignment";

            setError(message);
            return { success: false, data: null, message };
        } finally {
            setCreating(false);
        }
    }, []);


    const updateAssignment = useCallback(async (assignmentId, payload) => {
        if (!assignmentId) {
            return {
                success: false,
                data: null,
                message: "Assignment ID is required",
            };
        }

        // only send non-null changed fields
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== null && v !== undefined)
        );

        if (Object.keys(cleanPayload).length === 0) {
            return {
                success: false,
                data: null,
                message: "No changes to update",
            };
        }

        try {
            setUpdating(true);
            setError(null);
            setUploadProgress(0);
            setUploadedBytes(0);
            setMediaStatus(null);

            const response = await updateAssignmentService(assignmentId, cleanPayload);
            const data = response?.data || response;

            return {
                success: true,
                data,
                message: "Assignment updated successfully",
            };
        } catch (err) {
            let message = "Failed to update assignment";
            if (err.response?.status === 400) message = "Please check the entered assignment details";
            if (err.response?.status === 403) message = "You do not have permission to update this assignment";
            if (err.response?.status === 404) message = "Assignment not found";
            if (err.response?.status >= 500) message = "Server error while updating assignment";

            setError(message);
            return { success: false, data: null, message };
        } finally {
            setUpdating(false);
        }
    }, []);

    return {
        createAssignment,
        updateAssignment,

        creating,
        updating,

        uploadProgress,
        uploadedBytes,
        mediaStatus,

        error,
        setError,
    };
}