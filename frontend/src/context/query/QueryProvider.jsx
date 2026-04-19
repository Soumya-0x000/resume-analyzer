'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const isDev = import.meta.env.DEV;

/**
 * @name QueryProvider
 * @description QueryProvider is a provider that is used to provide the query client to the application.
 * @param children - The children to be rendered.
 * @returns ReactNode
 */
export default function QueryProvider({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 min cache
                        retry: 1,
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: true,
                    },
                    mutations: {
                        retry: 0,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}

            {/* Devtools (only in development) */}
            {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
