import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context/auth/useAuth';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // If the user is NOT logged in, kick them to the login page.
    // The 'replace' prop is crucial here—it replaces the current history entry
    // so the user doesn't get stuck in an infinite loop if they click the "Back" button.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If they are logged in, render the child routes normally
    return <Outlet />;
};
