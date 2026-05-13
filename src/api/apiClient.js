import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRedirecting = false;

axiosInstance.interceptors.response.use(
    (response) => response.data,

    async (error) => {

        const status = error.response?.status;

        // Public routes that should NEVER redirect
        const publicRoutes = [
            "/login",
            "/forgot-password",
            "/reset-password"
        ];

        const isPublicRoute = publicRoutes.includes(
            window.location.pathname
        );

        if (
            status === 401 &&
            !isRedirecting &&
            !isPublicRoute
        ) {

            isRedirecting = true;

            console.warn("Session expired. Redirecting...");

            window.location.href = "/login";
        }

        const errorMessage =
            error.response?.data?.message ||
            "An unexpected error occurred";

        return Promise.reject({
            ...error,
            message: errorMessage,
        });
    }
);

export default axiosInstance;