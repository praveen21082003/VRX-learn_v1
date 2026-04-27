import axiosInstance from "../api/apiClient";


export const createAssignmentSubmission = async (payload) => {
    return axiosInstance.post("/api/v1/assignment-submission/", payload);
}

export const getSubmission = async (submissionId) => {
    return axiosInstance.get(`/api/v1/assignment-submission/${submissionId}`)
}

export const patchSubmissionGrade = async (submissionId, payload) => {
    return axiosInstance.patch(`/api/v1/assignment-submission/${submissionId}/verify`, payload)
}