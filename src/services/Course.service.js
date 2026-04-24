
import axiosInstance from '../api/apiClient'

export const createCourseService = (payload) => {
    return axiosInstance.post('/api/v1/courses/', payload)
}

export const updateCourseBasicInfoService = (courseId, payload) => {
    return axiosInstance.patch(`/api/v1/courses/update-basic-info/${courseId}`, payload)
}

export const deleteCourseService = (courseId) => {
    return axiosInstance.delete(`/api/v1/courses/${courseId}`)
}