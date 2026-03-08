import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Paths that should use the old/public navbar (Home, Login, Register, Marketplace etc for non-logged-in)
    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'];
    const isPublic = publicPaths.includes(location.pathname);

    // If not logged in or on a public path, use the simple layout
    if (!user || isPublic) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50/50">
                <Navbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-col flex-1 w-full overflow-hidden">
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-grow overflow-x-hidden overflow-y-auto bg-gray-50 custom-scrollbar relative">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-agro-100/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-agro-200/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>

                    <div className="p-4 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
