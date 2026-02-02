import React from 'react';
import { Skeleton } from './Loading';

export const ProfilePageSkeleton = () => {
    return (
        <div className="w-full animate-pulse">

            {/* Header Skeleton */}
            <div className="bg-[#111e48]/50 rounded-2xl p-8 border border-white/5 mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Profile Pic */}
                    <Skeleton variant="circular" className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-[#071236]" />

                    {/* Info */}
                    <div className="flex-1 flex flex-col items-center sm:items-start gap-3 w-full">
                        <Skeleton variant="text" className="h-8 w-48 sm:w-64 bg-white/10" />
                        <Skeleton variant="text" className="h-4 w-32 bg-white/5" />
                        <Skeleton variant="rectangular" className="h-6 w-20 rounded-full bg-white/5" />

                        <div className="mt-2 space-y-2 w-full max-w-xs">
                            <Skeleton variant="text" className="h-4 w-full bg-white/5" />
                            <Skeleton variant="text" className="h-4 w-2/3 bg-white/5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-4 mb-8 border-b border-white/5 pb-1">
                <Skeleton variant="text" className="h-8 w-32 bg-white/5" />
                <Skeleton variant="text" className="h-8 w-32 bg-white/5" />
            </div>

            {/* Content Skeleton (Form) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#0a1f4a]/30 rounded-xl p-6 border border-white/5 h-64">
                    <Skeleton variant="text" className="h-6 w-40 mb-4 bg-white/10" />
                    <div className="space-y-4">
                        <Skeleton variant="text" className="h-4 w-full bg-white/5" />
                        <Skeleton variant="text" className="h-4 w-full bg-white/5" />
                        <Skeleton variant="text" className="h-4 w-3/4 bg-white/5" />
                    </div>
                </div>
                <div className="bg-[#0a1f4a]/30 rounded-xl p-6 border border-white/5 h-64">
                    <Skeleton variant="text" className="h-6 w-40 mb-4 bg-white/10" />
                    <div className="space-y-4">
                        <Skeleton variant="text" className="h-4 w-full bg-white/5" />
                        <Skeleton variant="text" className="h-4 w-full bg-white/5" />
                        <Skeleton variant="text" className="h-4 w-3/4 bg-white/5" />
                    </div>
                </div>
            </div>

        </div>
    );
};
