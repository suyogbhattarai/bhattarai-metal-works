'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md', 
    color = 'border-[#f6423a]',
    text 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
        xl: 'w-12 h-12 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin`} />
            {text && <p className="text-gray-400 text-sm animate-pulse">{text}</p>}
        </div>
    );
};

interface FullPageLoadingProps {
    message?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
    message = 'Loading...' 
}) => {
    return (
        <>
        <Navbar/>
        <div className="fixed inset-0 bg-[#071236]/95 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-[#111e48]/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        {/* Outer ring */}
                        <div className="w-16 h-16 border-4 border-white rounded-full" />
                        {/* Spinning ring */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin" />
                        {/* Inner pulsing circle */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 rounded-full animate-pulse" />
                    </div>
                    <p className="text-white font-medium text-lg">{message}</p>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

interface ButtonLoadingProps {
    text?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({ 
    text = 'Loading...' 
}) => {
    return (
        <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {text}
        </span>
    );
};

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
    className = '', 
    variant = 'rectangular' 
}) => {
    const baseClasses = 'bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 animate-pulse';
    
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    return (
        <>
      
                <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />

        </>
    );
};