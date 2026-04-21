import axiosInstance from '../api/apiClient'


// Update course info
export const updateCourseInfo = (courseId, payload) => {
    return axiosInstance.patch(`/api/v1/courses/update-basic-info/${courseId}`, payload)
}