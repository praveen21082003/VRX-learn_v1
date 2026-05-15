import axiosInstance from '../api/apiClient'


export const createIssues = (payload) => {
    return axiosInstance.post('/api/v1/issues/', payload)
}

export const updateIssues = (issueId, status) => {
    return axiosInstance.patch(
        `/api/v1/issues/${issueId}`,
        null,          // no request body
        {
            params: { status },   // status goes as query param
        }
    );
};

export const getIssues = (issueId) => {
    return axiosInstance.get(`/api/v1/issues/${issueId}`)
}
