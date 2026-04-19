import { createBrowserRouter } from 'react-router';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import App from '@/App';
import { ThemeProvider } from '@/context/theme/ThemeProvider';

const routes = [
    {
        path: '/',
        element: (
            <ThemeProvider>
                <App />
            </ThemeProvider>
        ),
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
        ],
    },
];

export const AppRouter = createBrowserRouter(routes);
