import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true,
    timeout: 7000,
    timeoutErrorMessage: 'Request timed out',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
    },
});

// request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error),
);

// response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error?.response?.data?.message || error?.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    },
);

export default api;
