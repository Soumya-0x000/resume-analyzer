import { useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useLogout, useMe } from '@/features/auth/services/auth.queries';
import api, { authApi } from '@/lib/axios';
import { Loader } from '@/components/ui/loader/Loader';
import { AuthContext } from './AuthContext';

const TOKEN_EXPIRY_BUFFER = 60;

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
    const [authToken, setAuthTokenState] = useState(null);
    const authTokenRef = useRef(null);
    const isLoggingOut = useRef(false);

    const { data: user, isLoading, isError } = useMe();
    const { mutateAsync: logoutApi } = useLogout();

    const setAuthToken = useCallback((token) => {
        authTokenRef.current = token;
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
        setAuthTokenState(token);
    }, []);

    const logout = useCallback(
        async (message = 'Session Expired. Please login again.') => {
            if (isLoggingOut.current) return;
            try {
                isLoggingOut.current = true;
                setAuthToken(null);
                await logoutApi();
                toast.info(message);
            } catch (error) {
                console.error('Error logging out:', error);
            } finally {
                isLoggingOut.current = false;
            }
        },
        [logoutApi, setAuthToken],
    );

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                const currentToken = authTokenRef.current;
                if (!currentToken) return config;

                const decoded = jwtDecode(currentToken);
                const timeToExpire =
                    decoded.exp !== undefined ? dayjs.unix(decoded.exp).diff(dayjs(), 'second') : 0;

                if (timeToExpire > TOKEN_EXPIRY_BUFFER) {
                    config.headers.Authorization = `Bearer ${currentToken}`;
                    return config;
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const response = await authApi.post('/auth/refresh-token');
                        console.log(response.data);
                        const newToken = response.data.data.accessToken;
                        setAuthToken(newToken);
                        config.headers.Authorization = `Bearer ${newToken}`;
                        processQueue(null, newToken);
                        return config;
                    } catch (error) {
                        processQueue(error, null);
                        logout();
                        return Promise.reject(error);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        config.headers.Authorization = `Bearer ${token}`;
                        return config;
                    })
                    .catch((err) => Promise.reject(err));
            },
            (error) => Promise.reject(error),
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error);
                }

                // No token or logging out — don't attempt refresh
                if (!authTokenRef.current || isLoggingOut.current) {
                    return Promise.reject(error);
                }

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
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
                    logout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            },
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [logout, setAuthToken]);
    // removed authToken from deps — interceptors read from ref, no need to re-register

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user: isError ? null : user,
                isAuthenticated: !!user && !isError,
                authToken,
                setAuthToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
