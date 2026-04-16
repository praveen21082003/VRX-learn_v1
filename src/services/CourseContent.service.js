import axiosInstance from "../api/apiClient";

export const getTraineeCourseContent = async (courseId) => {
    return axiosInstance.get(`/api/v1/course-contents/trainee/${courseId}`);
};

export const getTrainerCourseContent = async (courseId) => {
    return axiosInstance.get(`/api/v1/course-contents/trainer/${courseId}`);
};