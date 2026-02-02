'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchProjects } from '@/utils/lib/redux/features/management/managementSlice';
import {
    MdAssignment,
    MdCalendarMonth,
    MdOutlineTimer,
    MdCheckCircleOutline,
    MdAdd,
    MdMoreVert,
    MdChevronRight,
    MdPersonAdd,
} from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProjectsClient() {
    const dispatch = useDispatch();
    const router = useRouter(); // Initialize router
    const { projects, projectsLoading } = useSelector((state: RootState) => state.management);

    useEffect(() => {
        dispatch(fetchProjects() as any);
    }, [dispatch]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-400';
            case 'active': return 'bg-blue-500/10 text-blue-400';
            case 'planning': return 'bg-amber-500/10 text-amber-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#f6423a]">Projects</span>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-white">Projects</h1>
                        <p className="text-gray-500 text-sm font-medium">Manage and track structural metal works.</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/projects/new')}
                        className="bg-[#f6423a] text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#e03229] transition-all"
                    >
                        <MdAdd size={20} /> New Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Simplified Project List */}
                <div className="lg:col-span-3">
                    <div className="bg-[#111e48]/40 border border-white/5 rounded-3xl overflow-hidden min-h-[50vh]">
                        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <h2 className="text-lg font-black text-white uppercase tracking-tight">Ongoing Pipeline</h2>
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{projects.filter(p => p.status === 'active').length} Active</span>
                        </div>

                        {projectsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <FiLoader className="animate-spin text-[#f6423a] mb-4" size={48} />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Fetching Pipeline...</p>
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {projects.map((project) => (
                                    <div key={project.id} className="p-8 hover:bg-white/5 transition-all flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-[#f6423a] shrink-0 font-black">
                                            #{project.id}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-black text-white truncate">{project.title}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-xs font-medium truncate mb-2">Client: {project.client_name || 'Anonymous'}</p>
                                            <div className="flex gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                                                    <MdCalendarMonth size={14} className="text-blue-400" />
                                                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button title="Assign Staff" className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                                                <MdPersonAdd size={20} />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                                                title="Project Details"
                                                className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                                            >
                                                <MdChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 px-10">
                                <MdAssignment size={64} className="mx-auto text-gray-800 mb-6" />
                                <p className="text-gray-500 font-medium font-italic italic">The project pipeline is currently empty.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Simplified Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-[#111e48]/60 border border-white/5 p-8 rounded-3xl">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Overview</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] text-gray-500 font-black uppercase">Total Projects</span>
                                <span className="text-4xl font-black text-white">{projects.length}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl text-center">
                                    <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Active</p>
                                    <p className="text-xl font-black text-blue-400">{projects.filter(p => p.status === 'active').length}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl text-center">
                                    <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Done</p>
                                    <p className="text-xl font-black text-green-400">{projects.filter(p => p.status === 'completed').length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-dashed border-white/10 p-6 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <MdCheckCircleOutline className="text-green-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest">Efficiency</h3>
                        </div>
                        <p className="text-[11px] text-gray-500 italic leading-relaxed">
                            System metrics indicate all current active projects are within deadline safety zones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
