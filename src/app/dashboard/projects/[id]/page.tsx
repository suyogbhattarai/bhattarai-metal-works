'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import {
    fetchProjects,
    createProject,
    updateProject
} from '@/utils/lib/redux/features/management/managementSlice';
import { useToast, ToastContainer } from '@/components/toast';
import { MdArrowBack, MdSave, MdCalendarMonth, MdPerson, MdDescription, MdWork } from 'react-icons/md';
import Link from 'next/link';

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { projects, projectsLoading } = useSelector((state: RootState) => state.management);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        client_name: '',
        status: 'planning', // planning, active, completed
        deadline: '',
        description: ''
    });

    const isNew = id === 'new';
    const currentProject = !isNew ? projects.find(p => p.id === parseInt(id as string)) : null;

    useEffect(() => {
        if (projects.length === 0) {
            dispatch(fetchProjects() as any);
        }
    }, [dispatch, projects.length]);

    useEffect(() => {
        if (currentProject) {
            setFormData({
                title: currentProject.title,
                client_name: currentProject.client_name || '',
                status: currentProject.status || 'planning',
                deadline: currentProject.deadline ? new Date(currentProject.deadline).toISOString().split('T')[0] : '',
                description: (currentProject as any).description || ''
            });
        }
    }, [currentProject]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isNew) {
                await dispatch(createProject(formData) as any).unwrap();
                showSuccess('Project created successfully');
                router.push('/dashboard/projects');
            } else {
                await dispatch(updateProject({ id: parseInt(id as string), data: formData }) as any).unwrap();
                showSuccess('Project updated successfully');
                dispatch(fetchProjects() as any);
            }
        } catch (err: any) {
            showError(err || 'Failed to save project');
        } finally {
            setSubmitting(false);
        }
    };

    if (projectsLoading && !isNew && !currentProject) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
            </div>
        );
    }

    const inputClass = "w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition text-sm font-medium placeholder-gray-600";
    const labelClass = "block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2";

    return (
        <div className="space-y-6 pb-12">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/projects" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                    <MdArrowBack size={24} />
                </Link>
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/projects" className="hover:text-white transition">Projects</Link>
                        <span>/</span>
                        <span className="text-[#f6423a]">{isNew ? 'New Project' : currentProject?.title || 'Edit Project'}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">{isNew ? 'Create New Project' : 'Edit Project Details'}</h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8 max-w-4xl">
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                            <label className={labelClass}>Project Title *</label>
                            <div className="relative">
                                <MdWork className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    required
                                    name="title"
                                    className={`${inputClass} pl-12`}
                                    placeholder="e.g. Steel Warehouse Construction"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Client Name</label>
                            <div className="relative">
                                <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    name="client_name"
                                    className={`${inputClass} pl-12`}
                                    placeholder="Client Name or Company"
                                    value={formData.client_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Project Status</label>
                            <select
                                name="status"
                                className={inputClass}
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="planning">Planning Phase</option>
                                <option value="active">Active / In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="on_hold">On Hold</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Deadline</label>
                            <div className="relative">
                                <MdCalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="date"
                                    name="deadline"
                                    className={`${inputClass} pl-12`}
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>Project Description / Scope</label>
                        <div className="relative">
                            <MdDescription className="absolute left-4 top-4 text-gray-600" />
                            <textarea
                                name="description"
                                rows={6}
                                className={`${inputClass} pl-12 resize-none`}
                                placeholder="Detailed description of the project scope, requirements, and notes..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/projects')}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-[#f6423a] hover:bg-[#e03229] text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <MdSave size={18} />
                            {submitting ? 'Saving...' : isNew ? 'Create Project' : 'Update Project'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
