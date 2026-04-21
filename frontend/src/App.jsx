import React from 'react';
import { Outlet } from 'react-router';

const App = () => {
    return (
        <div className="min-h-screen h-screen min-w-screen w-screen flex">
            {/* Future: <Sidebar /> */}
            <main className="flex-1 w-full h-full">
                {/* Renders your dashboard, settings, etc. */}
                <Outlet />
            </main>
        </div>
    );
};

export default App;
