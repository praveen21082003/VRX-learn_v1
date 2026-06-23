import axiosInstance from '../api/apiClient'


// ----- Admin list View ------

// Users fetch and export csv
export const getUsers = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/users', {
        params,
    })
}

export const exportUsers = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/users/export', {
        params,
        responseType: "blob",
    })
}

// ---------------  Enrollments fetch and export ----------------
export const getEnrollments = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/enrollments', {
        params,
    })
}

export const exportEnrollments = (params = {}) => {
    return axiosInstance.get("/api/v1/list/admin/enrollments/export", {
        params,
        responseType: "blob",
    });
};

// Courses fetch and export csv
export const getCourses = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/courses', {
        params,
    })
}

export const exportCourses = (params = {}) => {
    return axiosInstance.get('/api/v1/list/admin/courses/export', {
        params,
        responseType: "blob",
    })
}


// trainee roster for trainer
export const getTraineesRoster = (courseId, params = {}) => {
    console.log("service", courseId, params);
    return axiosInstance.get(`/api/v1/list/trainer/trainees/${courseId}`, {
        params,
    })
}

export const exportTraineesRoster = (courseId, params = {}) => {
    return axiosInstance.get(`/api/v1/list/admin/trainees/${courseId}/export`, {
        params,
        responseType: "blob",
    })
}

export const getIssues = (params = {}) => {
    return axiosInstance.get(`/api/v1/list/admin/issues`, {
        params,
    })
}

// get list of modules by course id
export const getModules = (courseId) => {
    return axiosInstance.get(`/api/v1/list/trainer/modules/${courseId}`)
}