'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/utils/lib/redux/Store';
import {
    fetchPortfolioProjects,
    deletePortfolioProject,
    PortfolioProject
} from '@/utils/lib/redux/features/portfolio/portfolioSlice';
import {
    MdAdd,
    MdEngineering,
    MdEdit,
    MdDelete,
    MdLocationOn,
    MdPerson,
    MdCalendarToday,
    MdStar
} from 'react-icons/md';
import { useToast, ToastContainer } from '@/components/toast';
import { ServiceCardSkeleton } from '@/components/Skeletons';
import Link from 'next/link';
import { getApiImageUrl } from '@/utils/imageUrl';

export default function PortfolioClient() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { projects, loading, error } = useSelector((state: RootState) => state.portfolio);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    useEffect(() => {
        dispatch(fetchPortfolioProjects({}) as any);
    }, [dispatch]);

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this portfolio project?')) return;
        try {
            await dispatch(deletePortfolioProject(slug) as any).unwrap();
            showSuccess('Project deleted successfully');
        } catch (err: any) {
            showError(err || 'Failed to delete project');
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#f6423a]">Portfolio</span>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Showcase Gallery</h1>
                        <p className="text-gray-500 text-sm font-medium">Manage public-facing architectural projects and works.</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/portfolio/new')}
                        className="bg-[#f6423a] text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#ff554d] transition-all shadow-lg shadow-red-900/40"
                    >
                        <MdAdd size={20} /> Add New Project
                    </button>
                </div>
            </div>

            {loading ? (
                <ServiceCardSkeleton />
            ) : Array.isArray(projects) && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className="group relative bg-[#111e48] rounded-[2rem] border border-white/5 overflow-hidden hover:border-[#f6423a]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/10 flex flex-col"
                        >
                            {/* Image Area */}
                            <div className="aspect-[16/10] bg-[#0a1642] relative overflow-hidden">
                                {project.is_featured && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 bg-[#f6423a] text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-1">
                                            <MdStar size={10} /> Featured
                                        </span>
                                    </div>
                                )}

                                {/* Action Overlay */}
                                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                                    <button
                                        onClick={() => router.push(`/dashboard/portfolio/${project.slug}`)}
                                        className="p-2.5 rounded-xl bg-white/10 hover:bg-[#f6423a] text-white backdrop-blur-md transition-all duration-300 border border-white/10"
                                        title="Edit"
                                    >
                                        <MdEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.slug)}
                                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-white backdrop-blur-md transition-all duration-300 border border-red-500/10"
                                        title="Delete"
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>

                                {project.primary_image ? (
                                    <img
                                        src={getApiImageUrl(project.primary_image.image) || ''}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-white/5">
                                        <MdEngineering size={64} />
                                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1642] via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Content Area */}
                            <div className="p-6 flex-1 flex flex-col">
                                <span className="text-[9px] font-black text-[#f6423a] uppercase tracking-[0.2em] mb-2">
                                    {project.category_detail?.name || 'Uncategorized'}
                                </span>
                                <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-[#f6423a] transition-colors">
                                    {project.title}
                                </h3>

                                <div className="flex flex-col gap-2 mb-6">
                                    {project.client_name && (
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                            <MdPerson className="text-gray-600" size={14} />
                                            <span>Client: {project.client_name}</span>
                                        </div>
                                    )}
                                    {project.location && (
                                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                            <MdLocationOn className="text-gray-600" size={14} />
                                            <span>{project.location}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-black uppercase">
                                        <MdCalendarToday size={12} />
                                        {project.completion_date || 'Ongoing'}
                                    </div>
                                    <Link
                                        href={`/portfolio/${project.slug}`}
                                        target="_blank"
                                        className="text-[10px] text-[#f6423a] font-black uppercase tracking-widest hover:underline"
                                    >
                                        Live View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                    <MdEngineering size={64} className="mx-auto text-gray-800 mb-6" />
                    <p className="text-gray-500 font-medium italic">Your showcase is currently empty. Start adding projects!</p>
                </div>
            )}
        </div>
    );
}
