'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';

interface TopbarProps {
    onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <header className="sticky top-0 z-30 bg-[#0a1642]/80 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-sm text-gray-400">Welcome back, {user?.first_name || user?.username}!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#f6423a]/10 border border-[#f6423a]/20 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-300">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;