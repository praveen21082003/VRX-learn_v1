import axiosInstance from '../api/apiClient'


// reorder Modules
export const reorderModules = (moduleId, params) => {
    return axiosInstance.patch(`/api/v1/modules/${moduleId}/update-position`, params,)
}

// get modules
export const getModuleById = (moduleId) => {
    return axiosInstance.get(`/api/v1/modules/${module_id}`)
}


// Update module
export const updateModuleById = (moduleId, payload) => {
    return axiosInstance.patch(`/api/v1/modules/${module_id}`, payload)
}

// delete module
export const deleteModuleById = (moduleId) => {
    return axiosInstance.delete(`/api/v1/modules/${moduleId}`)
}


//  createModule
export const createModule = (payload) => {
    return axiosInstance.post('/api/v1/modules/', payload)
}