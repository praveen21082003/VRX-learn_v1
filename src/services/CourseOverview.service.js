import axiosInstance from "../api/apiClient";


export const getCourseTraineeOverview = (courseId) => {
    return axiosInstance.get(`/api/v1/trainee/course-overview/${courseId}`)
}

export const getCourseTrainerOverview = (courseId) => {
    return axiosInstance.get(`/api/v1/trainer/course-overview/${courseId}`)
}