import axiosInstance from "../api/apiClient";

export const getCurrentCourse = () => {
    return axiosInstance.get('/api/v1/dashboard/trainee/current-course')
}

export const getTopCourses = (n) => {
    return axiosInstance.get(`/api/v1/dashboard/trainee/top-new-courses/${n}`)
}


export const getEnrolledCourses = () => {
    return axiosInstance.get('/api/v1/dashboard/trainee/enrolled-courses')
}