import { useCallback, useState } from "react";

import {
  createIssues,
  createIssueswithAttachment,
  updateAttachmentIssues,
} from "@/services/Issues.service";
import { UploadMediaToS3 } from "@/services/UploadMediaToS3.service";
import { extractErrorMessage } from "@/utils/errorUtils";
import { getUploadErrorMessage } from "@/utils/S3errorUtils";

export const useCreateReport = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadedData, setLoadedData] = useState(0);
  const [mediaStatus, setMediaStatus] = useState(null);

  const createReport = useCallback(async (payload, file = null) => {
    setCreating(true);
    setError(null);
    setUploadProgress(0);
    setLoadedData(0);
    setMediaStatus(null);

    try {
      
      let requestPayload;

      const res = file
        ? await createIssueswithAttachment({
            issue: payload,
            attachment: {
              filename: file.name,
              contentType: file.type,
              size: file.size,
            },
          })
        : await createIssues(payload);

      const uploadUrl = res?.media?.url;
      const reportId = res?.data?.id;


      if (file) {
        if (!uploadUrl || !reportId) {
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
            },
          );

          if (uploadResponse?.status !== 200) {
            return {
              success: false,
              data: null,
              message: "Failed to upload report attachment",
            };
          }
        } catch (uploadErr) {
          const message = getUploadErrorMessage(uploadErr);
          setError(message);
          return {
            success: false,
            data: null,
            message,
          };
        }

        const attachmentResponse = await updateAttachmentIssues(reportId);
        const mediaData = attachmentResponse?.data || attachmentResponse;
        setMediaStatus(mediaData?.status || null);
      }

      return {
        success: true,
        data: res?.data || res,
        reportId,
        message: "Report submitted successfully",
      };
    } catch (err) {
      console.log(err);
      const status = err?.response?.status;

      const message = extractErrorMessage(err, {
        400: "Invalid report details provided.",
        401: "Please login to continue.",
        403: "You do not have permission to create reports.",
        404: "Requested resource not found.",
        409: "A similar report already exists.",
        413: "Uploaded file is too large.",
        415: "Unsupported file type.",
        500: "Server error while submitting report.",
      });

      setError(message);

      return {
        success: false,
        data: null,
        message,
        status,
      };
    } finally {
      setCreating(false);
    }
  }, []);

  return {
    createReport,
    creating,
    error,
    setError,
    uploadProgress,
    loadedData,
    mediaStatus,
  };
};