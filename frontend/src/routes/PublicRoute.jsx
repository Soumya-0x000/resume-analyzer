import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/auth/useAuth';

export const PublicRoute = () => {
    const { isAuthenticated } = useAuth();

    // If the user IS already logged in, kick them to the dashboard/home.
    if (isAuthenticated) {
        // Replace '/' with your actual post-login destination path if different
        return <Navigate to="/" replace />;
    }

    // If they are not logged in, let them see the login/register forms
    return <Outlet />;
};
