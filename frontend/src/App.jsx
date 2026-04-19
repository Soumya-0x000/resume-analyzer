import React from 'react';
import { Outlet } from 'react-router';
import { Toaster } from './components/ui/sonner';

const App = () => {
    return (
        <div className="min-h-screen h-screen min-w-screen w-screen">
            <Toaster richColors position="top-left" />
            <Outlet />
        </div>
    );
};

export default App;
