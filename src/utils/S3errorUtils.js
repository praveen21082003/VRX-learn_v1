export const getUploadErrorMessage = (err) => {
    if (!err.response) {
        return "Upload failed. Please check your internet connection.";
    }

    const status = err.response.status;
    const data = err.response.data;

    const errorText =
        typeof data === "string"
            ? data
            : JSON.stringify(data || "");

    if (status === 403) {
        if (errorText.includes("Expired")) {
            return "Upload session expired. Please try again.";
        }
        return "Upload failed. You are not authorized.";
    }

    if (status === 400) {
        return "Invalid upload request. Please retry.";
    }

    if (status === 404) {
        return "Upload destination not found.";
    }

    if (status === 413) {
        return "File is too large. Please upload a smaller file.";
    }

    if (status === 415) {
        return "Unsupported file type.";
    }

    if (status >= 500) {
        return "Server error during upload. Please try again.";
    }

    return "Upload failed. Please try again.";
};