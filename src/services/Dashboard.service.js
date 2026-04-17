import axiosInstance from "../api/apiClient";


// Current Course, Current in progress course
export const getCurrentCourse = () => {
    return axiosInstance.get('/api/v1/dashboard/trainee/current-course')
}

// Top N courses eg: n = 3 only top 3 courses
export const getTopCourses = (n) => {
    return axiosInstance.get(`/api/v1/dashboard/trainee/top-new-courses/${n}`)
}

// tranee Enrolled Courses
export const getTraineeEnrolledCourses = () => {
    return axiosInstance.get('/api/v1/dashboard/trainee/enrolled-courses')
}

// Admin KPIs
export const getAdminKPIs = () => {
    return axiosInstance.get("/api/v1/dashboard/admin/kpis");
};


// Top N courses for admin
export const getAdminTopCourses = (n = 5) => {
    return axiosInstance.get(`/api/v1/dashboard/admin/top-enrolled-courses`, {
        params: { n }
    });
};

// Trainer KPIs
export const getTrainerKPIs = () => {
    return axiosInstance.get(`/api/v1/dashboard/trainer/kpis`);
}

// Trainer Enrolled courses
export const getTrainerAssignedCourses = () => {
    return axiosInstance.get(`/api/v1/dashboard/trainer/assigned-courses`)
}