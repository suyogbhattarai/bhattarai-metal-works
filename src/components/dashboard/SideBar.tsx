'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { logout } from '@/utils/lib/redux/features/auth/authSlice';
import Image from 'next/image';
import logo from '@/components/logo.png';
import {
    MdDashboard,
    MdInventory,
    MdCategory,
    MdDescription,
    MdCalendarToday,
    MdPeople,
    MdLogout,
    MdChevronLeft,
    MdChevronRight,
    MdAnalytics,
    MdBadge,
    MdAssignment,
    MdHandyman
} from 'react-icons/md';

const Sidebar = ({
    isOpen,
    onClose,
    collapsed,
    setCollapsed
}: {
    isOpen: boolean;
    onClose: () => void;
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { user, loading } = useSelector((s: RootState) => s.auth);

    // const [collapsed, setCollapsed] = useState(false); // Internal state removed

    const nav = [
        { name: 'Overview', href: '/dashboard', icon: <MdDashboard size={20} />, roles: ['admin', 'staff'] },
        { name: 'Products', href: '/dashboard/products', icon: <MdInventory size={20} />, roles: ['admin', 'staff'] },
        { name: 'Services', href: '/dashboard/services', icon: <MdHandyman size={20} />, roles: ['admin', 'staff'] },
        { name: 'Categories', href: '/dashboard/categories', icon: <MdCategory size={20} />, roles: ['admin', 'staff'] },
        { name: 'Portfolio', href: '/dashboard/portfolio', icon: <MdAnalytics size={20} />, roles: ['admin', 'staff'] },
        { name: 'HR / Staff', href: '/dashboard/hr', icon: <MdBadge size={20} />, roles: ['admin', 'staff'] },
        { name: 'Projects', href: '/dashboard/projects', icon: <MdAssignment size={20} />, roles: ['admin', 'staff'] },
        { name: 'Quotations', href: '/dashboard/quotations', icon: <MdDescription size={20} />, roles: ['admin', 'staff'] },
        { name: 'Bookings', href: '/dashboard/bookings', icon: <MdCalendarToday size={20} />, roles: ['admin', 'staff'] },
        { name: 'Users', href: '/dashboard/users', icon: <MdPeople size={20} />, roles: ['admin'] }
    ];

    const filtered = nav.filter(i => user?.role && i.roles.includes(user.role));

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />}

            <aside
                className={`
          fixed z-40 top-20 left-0 h-[calc(100vh-4rem)]
          ${collapsed ? 'w-16' : 'w-64'}
          bg-[#071236] backdrop-blur-xl
          border-r border-white/10
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                {/* Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-6 bg-[#f6423a] text-white p-1 rounded-full shadow-lg hidden lg:flex items-center justify-center hover:bg-[#e03229] transition"
                >
                    {collapsed ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />}
                </button>

                {/* Navigation */}
                <nav className="p-3 space-y-1 mt-4">
                    {loading || !user ? (
                        // Skeleton State
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                                <div className="w-5 h-5 rounded bg-white/10 animate-pulse shrink-0" />
                                <div className={`h-4 bg-white/10 animate-pulse rounded transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-32 opacity-100'}`} />
                            </div>
                        ))
                    ) : (
                        filtered.map(item => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
                                        ? 'bg-[#f6423a]/10 text-[#f6423a] border border-[#f6423a]/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <span className={active ? 'text-[#f6423a]' : 'group-hover:text-white'}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                                        }`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })
                    )}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 left-0 right-0 px-3">
                    {loading || !user ? (
                        <div className="px-3 py-2.5 flex items-center gap-3">
                            <div className="w-5 h-5 rounded bg-white/10 animate-pulse shrink-0" />
                            <div className={`h-4 bg-white/10 animate-pulse rounded transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-24 opacity-100'}`} />
                        </div>
                    ) : (
                        <button
                            onClick={() => dispatch(logout())}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                text-red-400 hover:bg-red-500/10 transition-all duration-200 group
            `}
                            title={collapsed ? 'Logout' : undefined}
                        >
                            <MdLogout size={20} />
                            <span className={`
                text-sm font-medium whitespace-nowrap transition-all duration-300
                ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
            `}>
                                Logout
                            </span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
