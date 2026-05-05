
export const extractErrorMessage = (err, customMessages = {}) => {
    const status = err?.response?.status;

    // 401 — handle globally
    if (status === 401) {
        window.location.href = "/login";
        return "Session expired. Please login again.";
    }

    // use custom message for this status if provided
    if (customMessages[status]) {
        return customMessages[status];
    }

    // 422 — validation error structure is different
    if (status === 422) {
        return "Please check the entered details and try again.";
    }

    // generic fallbacks
    if (status === 400) return "Invalid request. Please check the details.";
    if (status === 403) return "You do not have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 409) return "A conflict occurred. The resource may already exist.";
    if (status >= 500) return "Server error. Please try again later.";

    return "Something went wrong. Please try again.";
};