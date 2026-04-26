import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import { api, authApi } from '@/lib/axios';
import { useMe } from '@/features/auth/services/auth.queries'; // Adjust import path if needed
import { AuthContext } from './AuthContext';
import { Loader } from '@/components/ui/loader/Loader';

const TOKEN_EXPIRY_BUFFER = 60; // seconds

// -------------------------------------------------------------
// GLOBAL QUEUE VARIABLES (Must remain outside the component)
// -------------------------------------------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const queryClient = useQueryClient();

    // 1. Fetch User Data automatically on load
    // Because of the interceptors below, if this 401s on initial load,
    // it will automatically try to refresh before failing!
    const { data: user, isLoading, isError } = useMe();

    // 2. Centralized Logout Logic
    const logoutUser = useCallback(
        (message = 'Session Expired. Please login again.') => {
            setAuthToken(null);
            // Clear React Query cache so old user data doesn't persist
            queryClient.setQueryData(['auth', 'me'], null);
            queryClient.removeQueries({ queryKey: ['auth', 'me'] });
            toast.info(message);
        },
        [queryClient],
    );

    // 3. The Master Interceptors
    useEffect(() => {
        // LAYER 1: Request Interceptor
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                if (!authToken) return config;

                const decodedJWT = jwtDecode(authToken);
                const timeToExpire = dayjs.unix(decodedJWT.exp).diff(dayjs(), 'second');

                if (timeToExpire > TOKEN_EXPIRY_BUFFER) {
                    config.headers.Authorization = `Bearer ${authToken}`;
                    return config;
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const response = await authApi.post('/auth/refresh');
                        const newToken = response.data.accessToken;

                        setAuthToken(newToken);
                        config.headers.Authorization = `Bearer ${newToken}`;
                        processQueue(null, newToken);
                        return config;
                    } catch (error) {
                        processQueue(error, null);
                        logoutUser();
                        return Promise.reject(error);
                    } finally {
                        isRefreshing = false;
                    }
                } else {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            config.headers.Authorization = `Bearer ${token}`;
                            return config;
                        })
                        .catch((err) => Promise.reject(err));
                }
            },
            (error) => Promise.reject(error),
        );

        // LAYER 2: Response Interceptor
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise(function (resolve, reject) {
                            failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return api(originalRequest);
                            })
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        const response = await authApi.post('/auth/refresh');
                        const newToken = response.data.accessToken;

                        setAuthToken(newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        processQueue(null, newToken);

                        return api(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        logoutUser();
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            },
        );

        // Cleanup to prevent memory leaks
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [authToken, logoutUser]);

    // 4. Block rendering of routes until we know the user's initial state
    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader />
            </div>
        );
    }

    const isAuthenticated = !!user && !isError;

    const contextData = {
        user: isError ? null : user,
        isAuthenticated,
        authToken,
        setAuthToken,
        logoutUser,
    };

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
