import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    throw new Error('VITE_API_URL is not defined');
}

const axiosStructure = {
    baseURL: API_BASE_URL,
    withCredentials: true,
};

// Main API instance
export const api = axios.create({
    ...axiosStructure,
    timeout: 7000,
});

// Auth-only instance (no interceptors)
export const authApi = axios.create(axiosStructure);

export default api;
