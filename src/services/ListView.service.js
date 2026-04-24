import axiosInstance from '../api/apiClient'


// ----- Admin list View ------

// Users fetch
export const getUsers = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/users', {
        params,
    })
}

//  Enrollments fetch
export const getEnrollments = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/enrollments', {
        params,
    })
}

// Courses fetch
export const getCourses = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/courses', {
        params,
    })
}


// trainee roster for trainer
export const getTraineesRoster = (courseId, params = {}) => {
    return axiosInstance.get(`/api/v1/list/trainer/trainees/${courseId}`,{
        params,
    })
}