import axios, { AxiosError as _AxiosError } from "axios";

export const JWT_TOKEN_LOCAL_STORAGE_KEY = "ut";

export type AxiosError = _AxiosError<{ message: string }>;

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(JWT_TOKEN_LOCAL_STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosInstance;
