import axiosInstance from "../api/apiClient";


export const createAssignmentSubmission = async (payload) => {
    return axiosInstance.post("/api/v1/assignment-submission/", payload);
}