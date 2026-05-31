import { api, authApi } from '@/lib/axios';

export const login = (data) => authApi.post('/auth/login', data);
export const register = (data) => authApi.post('/auth/register', data);
export const checkUsernameOrEmail = (data) => authApi.post('/auth/check-username-or-email', data);

export const getMe = () => api.get('/auth/get-me');
export const updateMe = (data) => api.put('/auth/update-me', data);
export const logout = () => api.post('/auth/logout');
