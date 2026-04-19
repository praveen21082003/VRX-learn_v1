import axiosInstance from '../api/apiClient'

export const getMe = () => {
    return axiosInstance.get('/api/v1/users/me')
}

export const login = (email, password) => {
    return axiosInstance.post(`api/v1/users/login`, { email, password })
}

export const userLogout = () => {
    return axiosInstance.post('/api/v1/users/logout')
}

export const createUsers = (payload) => {
    return axiosInstance.post('api/v1/users', payload)
}

export const deleteUserService = (userId) => {
    return axiosInstance.delete(`/api/v1/users/${userId}`)
}