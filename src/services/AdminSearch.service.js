import axiosInstance from "../api/apiClient";


export const searchUser = (params) => {
    return axiosInstance.get(`api/v1/admin/search/users`, {
        params: params,
        paramsSerializer: {
            indexes: null
        }
    });
}

export const searchCourse = ({ query, signal }) => {
    return axiosInstance.get(`/api/v1/admin/search/courses`, {
        params: { course_name: query },
        signal: signal
    });
}