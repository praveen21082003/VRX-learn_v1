import axiosInstance from '../api/apiClient'


export const createIssues = (payload) => {
    return axiosInstance.post('/api/v1/issues/', payload)
}

export const createIssueswithAttachment = (payload) =>{
    return axiosInstance.post('/api/v1/issues/with-attachment' , payload)
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

export const updateAttachmentIssues = (issueId) => {
    return axiosInstance.patch(`/api/v1/issues/${issueId}/attachment/uploaded`)
}

export const getViewUrl = (issueId) =>{
    return axiosInstance.get(`/api/v1/issues/${issueId}/attachment/view-url`)
}