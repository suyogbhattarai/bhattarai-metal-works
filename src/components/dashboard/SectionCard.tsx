'use client';

import React from 'react';

export default function SectionCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}
