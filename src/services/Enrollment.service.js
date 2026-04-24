import axiosInstance from '../api/apiClient'

export const createEnrollment = (payload) => {
    return axiosInstance.post('/api/v1/enrollments', payload)
}

export const updateEnrollmentService = (enrollmentId, payload) => {
    return axiosInstance.patch(`/api/v1/enrollments/${enrollmentId}/update-status`, payload)
}

export const deleteEnrollmentService = (enrollmentId) => {
    return axiosInstance.delete(`/api/v1/enrollments/${enrollmentId}`)
}