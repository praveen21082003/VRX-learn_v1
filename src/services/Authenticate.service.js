import axiosInstance from '../api/apiClient'


export const authMe = () => {
    return axiosInstance.get('/api/v1/auth/me')
}

export const login = (payload) => {

    return axiosInstance.post(
        "/api/v1/auth/login",
        payload
    );
};


export const logout = () => {
    return axiosInstance.post('/api/v1/auth/logout')
};

export const forgotPassword = (email) => {
    return axiosInstance.post(
        "/api/v1/auth/forget-password",
        { email }
    );
};

// signup
export const signup = (payload) => {
    return axiosInstance.post(
        "/api/v1/auth/signup",
        payload
    );
};


// reset password
export const resetPassword = ({
    token,
    password,
    confirmPassword,
}) => {

    return axiosInstance.patch(
        "/api/v1/auth/reset-password",
        {
            password,
            confirmPassword,
        },
        {
            params: { token },
        }
    );
};

// verify email
export const verifyEmail = (token) => {
    return axiosInstance.patch(
        "/api/v1/auth/verify-email",
        null,           // no body
        {
            params: { token },
        }
    );
};