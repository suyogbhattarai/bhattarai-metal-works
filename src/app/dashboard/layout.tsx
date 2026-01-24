'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/SideBar';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/dashboard/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <div className="min-h-screen bg-[#0e1736]">

                {/* Fixed Navbar */}
                <Navbar variant="dashboard" onMenuClick={() => setSidebarOpen(true)} />

                {/* Sidebar (Fixed position handled internally) */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />

                {/* Main Content Area */}
                {/* Added top padding for Navbar and left padding for collapsed/expanded sidebar */}
                <div
                    className={`
                        pt-16 transition-all duration-300 min-h-screen flex flex-col
                        ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
                    `}
                >
                    <main className="flex-1 px-5 py-8 lg:p-9 text-white max-w-[1920px] mx-auto w-full">
                        {children}
                    </main>
                </div>

            </div>
        </ProtectedRoute>
    );
}
