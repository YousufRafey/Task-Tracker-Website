import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Notifications from './Notifications';

const Layout = () => {
    return (
        <div className="flex bg-gray-50 dark:bg-slate-900 min-h-screen relative overflow-hidden font-sans transition-colors duration-300">
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 dark:bg-indigo-900/20 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[80px]" />
            </div>

            <Notifications />
            <Sidebar />
            <main className="flex-1 overflow-auto relative z-10 scrollbar-hide">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
