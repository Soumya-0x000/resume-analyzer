import React from 'react';
import { Outlet } from 'react-router';

const App = () => {
    return (
        <div className="min-h-screen h-screen min-w-screen w-screen flex">
            <main className="flex-1 w-full h-full">
                <Outlet />
            </main>
        </div>
    );
};

export default App;
