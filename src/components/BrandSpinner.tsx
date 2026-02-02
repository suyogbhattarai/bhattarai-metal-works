import React from 'react';

interface BrandSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const BrandSpinner: React.FC<BrandSpinnerProps> = ({
    size = 'lg',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Outer Ring - Navy */}
            <div className={`${sizeClasses[size]} border-4 border-[#001f3e]/20 border-t-[#001f3e] rounded-full animate-spin`} />

            {/* Middle Ring - Coral */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-4 h-4' :
                    size === 'md' ? 'w-7 h-7' :
                        size === 'lg' ? 'w-11 h-11' : 'w-16 h-16'
                } border-4 border-[#d96a4a]/20 border-b-[#f6423a] rounded-full animate-spin-reverse`}
                style={{ animationDuration: '1.5s' }}
            />

            {/* Center Dot - White/Brand */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-1.5 h-1.5' :
                    size === 'md' ? 'w-2.5 h-2.5' :
                        size === 'lg' ? 'w-4 h-4' : 'w-6 h-6'
                } bg-[#f6423a] rounded-full animate-pulse`} />
        </div>
    );
};
