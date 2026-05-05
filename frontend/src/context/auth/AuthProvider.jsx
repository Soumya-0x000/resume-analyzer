import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useLogout, useMe } from "@/features/auth/services/auth.queries";
import api, { authApi } from "@/lib/axios";
import { Loader } from "@/components/ui/loader/Loader";
import { AuthContext } from "./AuthContext";

const TOKEN_EXPIRY_BUFFER = 60; // seconds

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
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { data: user, isLoading, isError } = useMe();
    const { mutateAsync: logoutApi } = useLogout();

    const logout = useCallback(
        async (message = "Session Expired. Please login again.") => {
            if (isLoggingOut) return;

            try {
                setIsLoggingOut(true);
                setAuthToken(null);
                await logoutApi();
                toast.info(message);
            } catch (error) {
                console.error("Error logging out:", error);
            } finally {
                setIsLoggingOut(false);
            }
        },
        [isLoggingOut, logoutApi]
    );

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                if (!authToken) return config;

                const decodedJWT = jwtDecode(authToken);

                // Fix 3: Guard against undefined exp
                const timeToExpire =
                    decodedJWT.exp !== undefined
                        ? dayjs.unix(decodedJWT.exp).diff(dayjs(), "second")
                        : 0;

                if (timeToExpire > TOKEN_EXPIRY_BUFFER) {
                    config.headers.Authorization = `Bearer ${authToken}`;
                    return config;
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const response = await authApi.post("/auth/refresh");
                        const newToken = response.data.accessToken;

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
            (error) => Promise.reject(error)
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (!authToken || isLoggingOut) {
                        return Promise.reject(error);
                    }

                    if (isRefreshing) {
                        return new Promise(
                            function (resolve, reject) {
                                failedQueue.push({ resolve, reject });
                            }
                                .then((token) => {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                    return api(originalRequest);
                                })
                                .catch((err) => Promise.reject(err))
                        );
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        const response = await authApi.post("/auth/refresh");
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
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [authToken, logout]);

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
        logout,
    };

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
