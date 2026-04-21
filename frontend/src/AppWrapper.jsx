import { ThemeProvider } from './context/theme/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import QueryProvider from './context/query/QueryProvider';
import { AuthProvider } from './context/auth/AuthProvider';
import { Outlet } from 'react-router';

export const AppWrapper = () => (
    <ThemeProvider>
        <Toaster richColors position="top-left" />
        <QueryProvider>
            <AuthProvider>
                <Outlet />
            </AuthProvider>
        </QueryProvider>
    </ThemeProvider>
);
