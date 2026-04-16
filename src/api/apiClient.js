import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Flag to prevent multiple redirects/refresh calls
let isRedirecting = false;

axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !isRedirecting) {
            // Avoid redirecting if we are already on the login page
            if (window.location.pathname === "/login") {
                return Promise.reject(error);
            }

            isRedirecting = true;
            console.warn("Session expired. Redirecting...");

            // Logic to clear local storage/state
            // localStorage.removeItem('user_session');

            window.location.href = "/login";
        }

        // Standardize error objects for your UI to consume
        const errorMessage = error.response?.data?.message || "An unexpected error occurred";
        return Promise.reject({ ...error, message: errorMessage });
    }
);

export default axiosInstance;