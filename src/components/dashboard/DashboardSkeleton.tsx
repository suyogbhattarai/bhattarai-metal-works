import React from 'react';
import { Skeleton } from '../Loading';

const DashboardSkeleton = () => {
    return (
        <div className="space-y-6 w-full animate-pulse">
            {/* Header Skeleton */}
            <div>
                <Skeleton variant="text" className="h-8 w-48 mb-2 bg-white/10" />
                <Skeleton variant="text" className="h-4 w-64 bg-white/5" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#111c44] rounded-xl p-5 border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className="space-y-3">
                                <Skeleton variant="text" className="h-4 w-24 bg-white/10" />
                                <Skeleton variant="text" className="h-8 w-16 bg-white/5" />
                            </div>
                            <Skeleton variant="circular" className="h-10 w-10 bg-white/5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-[#111c44] rounded-xl border border-white/5 h-64 p-5">
                        <div className="flex justify-between items-center mb-6">
                            <Skeleton variant="text" className="h-6 w-40 bg-white/10" />
                            <Skeleton variant="circular" className="h-8 w-8 bg-white/5" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg bg-white/5" />
                            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg bg-white/5" />
                            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg bg-white/5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
