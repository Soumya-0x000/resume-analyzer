import { createBrowserRouter } from 'react-router';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import { AppWrapper } from '@/AppWrapper';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import App from '@/App';

const routes = [
    {
        path: '/',
        element: <AppWrapper />,
        children: [
            {
                element: <PublicRoute />,
                children: [
                    {
                        index: true,
                        element: <Login />,
                    },
                    {
                        path: 'register',
                        element: <Register />,
                    },
                ],
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '',
                        element: <App />,
                        children: [],
                    },
                ],
            },
        ],
    },
];

export const AppRouter = createBrowserRouter(routes);
