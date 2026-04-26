import { api, authApi } from '@/lib/axios';

// ---------------------------------------------------------
// OUTSIDE THE CLUB (No token required / Naked API)
// ---------------------------------------------------------
export const login = (data) => authApi.post('/auth/login', data);
export const register = (data) => authApi.post('/auth/register', data);

// ---------------------------------------------------------
// INSIDE THE CLUB (Requires token & interceptors / Main API)
// ---------------------------------------------------------
export const getMe = () => api.get('/auth/get-me');
export const updateMe = (data) => api.put('/auth/update-me', data);
export const logout = () => api.post('/auth/logout');
