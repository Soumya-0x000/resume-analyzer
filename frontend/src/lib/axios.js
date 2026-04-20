import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const axiosStructure = {
    baseURL: API_BASE_URL,
    withCredentials: true,
};

// ----------------------------------------------------------------------
// 1. MAIN API INSTANCE
// (Interceptors will be attached to this later in the AuthProvider)
// ----------------------------------------------------------------------
export const api = axios.create({ ...axiosStructure, timeout: 7000 });

// ----------------------------------------------------------------------
// 2. NAKED AUTH API INSTANCE
// (Used ONLY for refreshing tokens. NO interceptors will be attached here)
// ----------------------------------------------------------------------
export const authApi = axios.create(axiosStructure);

export default api;
