'use client';

import React from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', title, description, action }) => {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            {description && <p className="text-gray-400 mb-6">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-[#f6423a] hover:bg-[#e03229] text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;