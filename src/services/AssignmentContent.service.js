import axiosInstance from "../api/apiClient";


export const getTraineeAssignmentContent = async (courseId) => {
    return axiosInstance.get(`/api/v1/assignment-contents/trainee/assignments/${courseId}`);
}

export const getTraineeAssignmentDetail = async (assignmentId) => {
    return axiosInstance.get(`/api/v1/assignment-contents/trainee/contents/${assignmentId}`);
}