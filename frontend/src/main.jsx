import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { AppRouter } from './routes/app.route';
import './index.css';
import QueryProvider from './context/query/QueryProvider';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryProvider>
            <RouterProvider router={AppRouter} />
        </QueryProvider>
    </StrictMode>,
);
