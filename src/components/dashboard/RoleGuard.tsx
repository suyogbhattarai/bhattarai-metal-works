'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';

interface RoleGuardProps {
    allowedRoles: ('admin' | 'staff')[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user || !allowedRoles.includes(user.role as any)) {
        return fallback || (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🚫</div>
                <p className="text-red-400 font-medium">Access Denied</p>
                <p className="text-gray-400 text-sm mt-2">You don't have permission to access this resource</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default RoleGuard;