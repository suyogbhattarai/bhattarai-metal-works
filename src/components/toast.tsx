'use client';

import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
    message, 
    type, 
    duration = 4000, 
    onClose 
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-500/90',
                    icon: <FaCheckCircle className="w-5 h-5" />,
                    progressBar: 'bg-green-300'
                };
            case 'error':
                return {
                    bg: 'bg-red-500/90',
                    icon: <FaExclamationCircle className="w-5 h-5" />,
                    progressBar: 'bg-red-300'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-500/90',
                    icon: <FaExclamationCircle className="w-5 h-5" />,
                    progressBar: 'bg-yellow-300'
                };
            case 'info':
            default:
                return {
                    bg: 'bg-blue-500/90',
                    icon: <FaInfoCircle className="w-5 h-5" />,
                    progressBar: 'bg-blue-300'
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={`
                ${styles.bg}
                backdrop-blur-md
                text-white
                px-4 sm:px-6
                py-3 sm:py-4
                rounded-lg
                shadow-2xl
                border border-white/20
                w-full sm:min-w-[300px]
                sm:max-w-md
                animate-slideIn
            `}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {styles.icon}
                </div>
                <p className="flex-1 text-sm font-medium leading-relaxed">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:bg-white/10 rounded p-1 transition-colors"
                >
                    <FaTimes className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${styles.progressBar} animate-shrink`}
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// Toast Container Component
// ------------------------------------------------------------------
interface ToastContainerProps {
    toasts: Array<{
        id: string;
        message: string;
        type: ToastType;
    }>;
    removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div
            className="
                fixed
                z-[9999]
                w-full
                px-4
                top-20
                sm:bottom-auto
                sm:top-35
                sm:right-4
                sm:w-auto
                space-y-3
                safe-bottom
            "
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

// ------------------------------------------------------------------
// Custom Hook for Toast Management
// ------------------------------------------------------------------
export const useToast = () => {
    const [toasts, setToasts] = React.useState<Array<{
        id: string;
        message: string;
        type: ToastType;
    }>>([]);

    const addToast = React.useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = React.useCallback((message: string) => {
        addToast(message, 'success');
    }, [addToast]);

    const showError = React.useCallback((message: string) => {
        addToast(message, 'error');
    }, [addToast]);

    const showInfo = React.useCallback((message: string) => {
        addToast(message, 'info');
    }, [addToast]);

    const showWarning = React.useCallback((message: string) => {
        addToast(message, 'warning');
    }, [addToast]);

    return {
        toasts,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning
    };
};
