import axiosInstance from "../api/apiClient";

export const createAssignment = (payload) => {
    return axiosInstance.post('/api/v1/assignments/', payload)
}

export const updateAssignment = (assignmentId, payload) => {
    return axiosInstance.patch(`/api/v1/assignments/${assignmentId}/update-details`, payload);
}

export const deleteAssignmnet = (assignmentId) => {
    return axiosInstance.delete(`/api/v1/assignments/${assignmentId}`)
}