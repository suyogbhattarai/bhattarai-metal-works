'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { FullPageLoading as Loading } from '@/components/Loading';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'staff' | 'user')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.replace('/login');
            } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                // User is authenticated but doesn't have the required role
                // We'll let the role guard handle the specific UI, but here we just mark as "ready"
                // or we could redirect to a 403 page. For now, let's mark authorized so RoleGuard can show the error.
                // Actually, let's just allow it here and let RoleGuard handle fine-grained control if used inside.
                // But for DASHBOARD level, we probably want to block entirely if they are just a 'user'.
                if (allowedRoles.includes('admin') || allowedRoles.includes('staff')) {
                    // If this IS a protected dashboard route, block regular users
                    setIsAuthorized(false); // Implicitly denied
                } else {
                    setIsAuthorized(true);
                }
            } else {
                setIsAuthorized(true);
            }
        }
    }, [isAuthenticated, loading, router, user, allowedRoles]);

    // Show loading spinner while checking auth state or if Redux is loading
    if (loading || (!isAuthenticated && !isAuthorized)) {
        return <Loading />;
    }

    // Role-based access denied (if we want to handle it at this level)
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#071236]">
                <div className="bg-[#111e48]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                        🚫
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-6">
                        You do not have permission to access this area.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
