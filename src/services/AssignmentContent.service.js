import axiosInstance from "../api/apiClient";

// trainee
export const getTraineeAssignmentContent = async (courseId) => {
    return axiosInstance.get(`/api/v1/assignment-contents/trainee/assignments/${courseId}`);
}

export const getTraineeAssignmentDetail = async (assignmentId) => {
    return axiosInstance.get(`/api/v1/assignment-contents/trainee/contents/${assignmentId}`);
}


// trainer
export const getTrainerAssignmentContent = async (courseId) => {
    return axiosInstance.get(`/api/v1/assignment-contents/trainer/assignments/${courseId}`);
}

export const getTrainerAssignmentDetail = async (assignmentId) => {
    return axiosInstance.get(`/api/v1/assignment-contents/trainer/contents/${assignmentId}`);
}

