import axiosInstance from '../api/apiClient'



//reorder lesson
export const reorderLessons = (lessonId, params) => {
    return axiosInstance.patch(`/api/v1/lessons/${lessonId}/update-position`, params)
}

export const getLessonsByModuleId = (moduleId) => {
    return axiosInstance.get(`/api/v1/list/trainer/lessons/${moduleId}`)
}


// create lesson
export const createLesson = (payload) => {
    return axiosInstance.post('/api/v1/lessons/', payload);
}

//update lesson
export const updateLesson = (lessonId, payload) => {
    return axiosInstance.patch(`/api/v1/lessons/${lessonId}/update`, payload)
}