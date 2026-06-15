import axiosInstance from "../api/apiClient";

// create assignment without attachment
export const createAssignment = (payload) => {
    return axiosInstance.post('/api/v1/assignments/', payload);
}

// create assignment with attachment
export const createAssignmentWithAttachment = (payload) => {
    return axiosInstance.post('/api/v1/assignments/with-attachment', payload);
}

// update assignment attachment status
export const updateAttachmentStatus = (assignmentId) => {
    return axiosInstance.patch(`/api/v1/assignments/${assignmentId}/attachment/uploaded`);
}

export const updateAssignment = (assignmentId, payload) => {
    return axiosInstance.patch(`/api/v1/assignments/${assignmentId}/update-details`, payload);
}

export const deleteAssignmnet = (assignmentId) => {
    return axiosInstance.delete(`/api/v1/assignments/${assignmentId}`);
}

// get Assignment view url
export const getAssignmentViewUrl = (assignmentId) => {
    return axiosInstance.get(`/api/v1/assignments/${assignmentId}/attachment/view-url`);
}