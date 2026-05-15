import axiosInstance from '../api/apiClient'


export const createUsers = (payload) => {
    return axiosInstance.post('api/v1/users', payload)
}

export const deleteUserService = (userId) => {
    return axiosInstance.delete(`/api/v1/users/${userId}`)
}