import axiosInstance from '../api/apiClient'



//reorder lesson
export const reorderLessons = (lessonId, params) => {
    return axiosInstance.patch(`/api/v1/lessons/${lessonId}/position`, params)
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
    return axiosInstance.patch(`/api/v1/lessons/${lessonId}`, payload)
}

//delete lesson
export const deleteLesson = (lessonId) => {
    return axiosInstance.delete(`/api/v1/lessons/${lessonId}`)
}

// update Attachment Status
export const updateAttachmentStatus = (lessonId) => {
    return axiosInstance.patch(`/api/v1/lessons/${lessonId}/attachment/uploaded`)
}

// Get View Lesson url
export const getLessonViewUrl = (lessonId) => {
    return axiosInstance.get(`/api/v1/lessons/${lessonId}/attachment/view-url`);
}