import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width,
    height,
    borderRadius = '0.75rem'
}) => {
    return (
        <div
            className={`animate-pulse bg-gray-200/60 ${className}`}
            style={{
                width: width,
                height: height,
                borderRadius: borderRadius
            }}
        />
    );
};

export const BentoSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[210px] gap-6">
        {[1, 1.5, 1, 1.2, 1.3, 1, 1.1, 1].map((flex, i) => (
            <div
                key={i}
                className="bg-white rounded-[2rem] p-6 border border-gray-100 flex flex-col justify-end gap-3"
                style={{ gridRow: `span ${Math.ceil(flex)}` }}
            >
                <Skeleton width="40%" height="12px" borderRadius="0.5rem" />
                <Skeleton width="80%" height="24px" borderRadius="0.5rem" />
                <div className="flex justify-between items-center mt-2">
                    <Skeleton width="30%" height="16px" borderRadius="0.5rem" />
                    <Skeleton width="32px" height="32px" borderRadius="1rem" />
                </div>
            </div>
        ))}
    </div>
);

export const ProductDetailSkeleton = () => (
    <div className="w-full max-w-[1920px] mx-auto lg:px-15 md:px-10 px-5 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Media Gallery Skeleton */}
            <div className="lg:col-span-7 space-y-4">
                <Skeleton className="w-full aspect-video md:max-h-[400px]" borderRadius="2rem" />
                <div className="flex gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} width="80px" height="80px" borderRadius="1.5rem" />
                    ))}
                </div>
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-5 space-y-8">
                <div>
                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} width="18px" height="18px" borderRadius="4px" />)}
                    </div>
                    <Skeleton width="70%" height="40px" className="mb-6" borderRadius="0.5rem" />
                    <Skeleton width="40%" height="32px" borderRadius="0.5rem" />
                </div>

                <div className="space-y-4">
                    <Skeleton width="30%" height="16px" className="mb-6" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-4">
                            <Skeleton width="24px" height="24px" borderRadius="50%" />
                            <div className="flex-1 space-y-2">
                                <Skeleton width="40%" height="14px" />
                                <Skeleton width="90%" height="12px" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </div>
);

// Dashboard Overview Skeleton
export const DashboardOverviewSkeleton = () => (
    <div className="space-y-8 animate-fadeIn">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#111e48]/40 border border-white/5 rounded-[2rem] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton width="60%" height="14px" borderRadius="0.5rem" />
                        <Skeleton width="40px" height="40px" borderRadius="1rem" />
                    </div>
                    <Skeleton width="50%" height="32px" borderRadius="0.5rem" />
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* SEO Health Card */}
            <div className="xl:col-span-1 bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton width="40%" height="20px" borderRadius="0.5rem" />
                    <Skeleton width="60px" height="16px" borderRadius="0.5rem" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                            <Skeleton width="70%" height="16px" className="mb-2" borderRadius="0.5rem" />
                            <div className="flex gap-2">
                                <Skeleton width="80px" height="20px" borderRadius="0.5rem" />
                                <Skeleton width="80px" height="20px" borderRadius="0.5rem" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Inquiries Table */}
            <div className="xl:col-span-2 bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton width="30%" height="20px" borderRadius="0.5rem" />
                    <Skeleton width="100px" height="16px" borderRadius="0.5rem" />
                </div>
                <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton width="20%" height="16px" borderRadius="0.5rem" />
                                <Skeleton width="25%" height="16px" borderRadius="0.5rem" />
                                <Skeleton width="15%" height="20px" borderRadius="1rem" />
                                <Skeleton width="10%" height="14px" borderRadius="0.5rem" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Service Card Skeleton
export const ServiceCardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#111e48]/40 border border-white/5 rounded-[2rem] p-8">
                <div className="flex justify-between items-start mb-6">
                    <Skeleton width="48px" height="48px" borderRadius="1rem" />
                    <Skeleton width="60px" height="24px" borderRadius="1rem" />
                </div>
                <Skeleton width="70%" height="24px" className="mb-2" borderRadius="0.5rem" />
                <Skeleton width="100%" height="14px" className="mb-2" borderRadius="0.5rem" />
                <Skeleton width="90%" height="14px" className="mb-6" borderRadius="0.5rem" />
                <div className="flex gap-3 pt-4 border-t border-white/5">
                    <Skeleton width="70%" height="40px" borderRadius="0.75rem" />
                    <Skeleton width="30%" height="40px" borderRadius="0.75rem" />
                </div>
            </div>
        ))}
    </div>
);

// Table Skeleton
export const TableSkeleton = () => (
    <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
        <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex justify-between items-center py-2">
                    <Skeleton width="15%" height="16px" borderRadius="0.5rem" />
                    <Skeleton width="25%" height="16px" borderRadius="0.5rem" />
                    <Skeleton width="20%" height="16px" borderRadius="0.5rem" />
                    <Skeleton width="15%" height="20px" borderRadius="1rem" />
                    <Skeleton width="10%" height="14px" borderRadius="0.5rem" />
                </div>
            ))}
        </div>
    </div>
);

// Staff Card Skeleton
export const StaffCardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#111e48]/40 border border-white/5 rounded-[2rem] p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton width="64px" height="64px" borderRadius="50%" />
                    <div className="flex-1">
                        <Skeleton width="70%" height="20px" className="mb-2" borderRadius="0.5rem" />
                        <Skeleton width="50%" height="14px" borderRadius="0.5rem" />
                    </div>
                </div>
                <div className="space-y-3 mb-6">
                    <Skeleton width="100%" height="14px" borderRadius="0.5rem" />
                    <Skeleton width="80%" height="14px" borderRadius="0.5rem" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                    <Skeleton width="50%" height="36px" borderRadius="0.75rem" />
                    <Skeleton width="50%" height="36px" borderRadius="0.75rem" />
                </div>
            </div>
        ))}
    </div>
);

// Project Card Skeleton
export const ProjectCardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111e48]/40 border border-white/5 rounded-[2rem] p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <Skeleton width="80%" height="24px" className="mb-2" borderRadius="0.5rem" />
                        <Skeleton width="50%" height="14px" borderRadius="0.5rem" />
                    </div>
                    <Skeleton width="60px" height="24px" borderRadius="1rem" />
                </div>
                <div className="space-y-3 mb-6">
                    <Skeleton width="100%" height="14px" borderRadius="0.5rem" />
                    <Skeleton width="90%" height="14px" borderRadius="0.5rem" />
                    <Skeleton width="70%" height="14px" borderRadius="0.5rem" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                    <Skeleton width="70%" height="40px" borderRadius="0.75rem" />
                    <Skeleton width="30%" height="40px" borderRadius="0.75rem" />
                </div>
            </div>
        ))}
    </div>
);
