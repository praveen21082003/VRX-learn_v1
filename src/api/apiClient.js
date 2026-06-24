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
        const type = error.response?.data?.type;

        const pathname = window.location.pathname;

        const publicRoutes = [
            "/login",
            "/forgot-password",
            "/verify-email",
            "/signup"
        ];

        const isPublicPage =
            publicRoutes.includes(pathname);

        // current request URL
        const requestUrl =
            error.config?.url || "";

        // auth endpoints should never redirect
        const isAuthEndpoint =
            requestUrl.includes("/api/v1/auth/login") ||
            requestUrl.includes("/api/v1/auth/forgot-password") ||
            requestUrl.includes("/api/v1/auth/reset-password") ||
            requestUrl.includes("/api/v1/auth/me");
            

        if (
            status === 401 &&
            type === "UnAuthenticated" &&
            !isRedirecting &&
            !isPublicPage &&
            !isAuthEndpoint
        ) {

            isRedirecting = true;


            console.warn(
                "Session expired. Redirecting to login..."
            );

            window.location.href = "/login";

            setTimeout(() => {
                isRedirecting = false;
            }, 5000);
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