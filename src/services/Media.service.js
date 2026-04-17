import axiosInstance from '../api/apiClient'

export const updateMediaStatus = (mediaId) => {
    return axiosInstance.patch(`/api/v1/media/${mediaId}/update-status`)
}

export const getMediaUrl = (mediaId) => {
    return axiosInstance.get(`/api/v1/media/${mediaId}`)
}

