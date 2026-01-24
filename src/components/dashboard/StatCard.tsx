'use client';

import React from 'react';

const StatCard = ({ title, value, icon, accent }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    accent?: boolean;
}) => (
    <div
        className={`
      relative rounded-xl p-4
      bg-[#111e48]/60 backdrop-blur-xl
      border border-white/5
      hover:border-white/10 transition duration-300
    `}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="mt-1 text-2xl font-bold text-white tracking-tight">{value}</p>
            </div>
            <div
                className={`
          w-10 h-10 rounded-lg flex items-center justify-center text-lg
          ${accent ? 'bg-[#f6423a]/10 text-[#f6423a]' : 'bg-white/5 text-gray-300'}
        `}
            >
                {icon}
            </div>
        </div>
    </div>
);

export default StatCard;
