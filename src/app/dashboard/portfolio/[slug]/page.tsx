'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import {
    fetchPortfolioProjects,
    fetchPortfolioCategories,
    createPortfolioProject,
    updatePortfolioProject,
    PortfolioProject
} from '@/utils/lib/redux/features/portfolio/portfolioSlice';
import { useToast, ToastContainer } from '@/components/toast';
import {
    MdArrowBack,
    MdInfo,
    MdCloudUpload,
    MdClose,
    MdStar,
    MdLocationOn,
    MdPerson,
    MdCalendarToday,
    MdCategory
} from 'react-icons/md';
import Link from 'next/link';
import { getApiImageUrl } from '@/utils/imageUrl';

export default function PortfolioDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { projects, categories, loading } = useSelector((state: RootState) => state.portfolio);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'seo'>('basic');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        client_name: '',
        client_logo: null as File | string | null,
        location: '',
        completion_date: '',
        is_featured: false,
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    const isNew = slug === 'new';
    const currentProject = !isNew ? projects.find(p => p.slug === slug) : null;

    useEffect(() => {
        dispatch(fetchPortfolioProjects({}) as any);
        dispatch(fetchPortfolioCategories() as any);
    }, [dispatch]);

    useEffect(() => {
        if (currentProject) {
            setFormData({
                title: currentProject.title,
                category: currentProject.category?.toString() || '',
                description: currentProject.description,
                client_name: currentProject.client_name || '',
                client_logo: currentProject.client_logo || null,
                location: currentProject.location || '',
                completion_date: currentProject.completion_date || '',
                is_featured: currentProject.is_featured,
                meta_title: currentProject.meta_title || '',
                meta_description: currentProject.meta_description || '',
                meta_keywords: currentProject.meta_keywords || ''
            });
        }
    }, [currentProject]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageId: number) => {
        setDeletedImageIds(prev => [...prev, imageId]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'client_logo') {
                if (value instanceof File) {
                    data.append(key, value);
                }
            } else if (value !== null && value !== undefined) {
                data.append(key, value.toString());
            }
        });

        selectedFiles.forEach(file => data.append('upload_images', file));
        deletedImageIds.forEach(id => data.append('remove_images', id.toString()));

        try {
            if (isNew) {
                await dispatch(createPortfolioProject(data) as any).unwrap();
                showSuccess('Project added to showcase');
                router.push('/dashboard/portfolio');
            } else {
                await dispatch(updatePortfolioProject({ slug: slug as string, formData: data }) as any).unwrap();
                showSuccess('Showcase project updated');
                dispatch(fetchPortfolioProjects({}) as any);
                setSelectedFiles([]);
                setPreviews([]);
                setDeletedImageIds([]);
            }
        } catch (err: any) {
            showError(err || 'Failed to save showcase project');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !isNew) {
        return <div className="flex justify-center py-20 animate-pulse text-[#f6423a]">Loading Portfolio Data...</div>;
    }

    return (
        <div className="space-y-6 pb-12">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex items-center gap-4">
                <Link href="/dashboard/portfolio" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#f6423a] text-white transition-all shadow-lg border border-white/5">
                    <MdArrowBack size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                        {isNew ? 'New Entry' : 'Refine Showcase'}
                    </h1>
                    <p className="text-gray-500 text-xs font-medium">Capture the legacy of your craftsmanship.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#111e48]/60 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="flex bg-[#050b2b] p-1.5 border-b border-white/5">
                    {['basic', 'images', 'seo'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl ${activeTab === tab ? 'bg-[#f6423a] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab === 'basic' ? 'Technical Details' : tab === 'images' ? 'Gallery' : 'Search Presence'}
                        </button>
                    ))}
                </div>

                <div className="p-8 md:p-10">
                    {activeTab === 'basic' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6 md:col-span-2">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Project Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#f6423a] transition-all" placeholder="e.g., Luxury Villa Spiral Staircase" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#050b2b] border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#f6423a] appearance-none cursor-pointer">
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Location</label>
                                    <div className="relative">
                                        <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-white focus:outline-none focus:border-[#f6423a]" placeholder="e.g., Kathmandu, Nepal" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Client / Business</label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-white focus:outline-none focus:border-[#f6423a]" placeholder="Company or Individual Name" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Client Logo</label>
                                    <div className="flex items-center gap-4">
                                        {(formData.client_logo) && (
                                            <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-white/5">
                                                <img
                                                    src={formData.client_logo instanceof File ? URL.createObjectURL(formData.client_logo) : getApiImageUrl(formData.client_logo as string) || ''}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}
                                        <label className="flex-1 cursor-pointer bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-gray-400 hover:border-[#f6423a]/50 transition-all text-center border-dashed">
                                            {formData.client_logo ? 'Change Logo' : 'Upload Client Logo'}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setFormData(prev => ({ ...prev, client_logo: e.target.files![0] }));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Completion Date</label>
                                    <div className="relative">
                                        <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input type="date" name="completion_date" value={formData.completion_date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-3.5 text-white focus:outline-none focus:border-[#f6423a]" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Project Narrative / Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:outline-none focus:border-[#f6423a] transition-all resize-none" placeholder="Explain the technical challenges and outcomes of this project..." />
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 md:col-span-2">
                                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded border border-white/10 bg-[#050b2b] text-[#f6423a] cursor-pointer" id="featured" />
                                <label htmlFor="featured" className="text-sm font-bold text-gray-300 cursor-pointer flex items-center gap-2">
                                    <MdStar className="text-amber-400" /> Feature this project in the main showcase gallery
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="space-y-10">
                            {currentProject?.images && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {currentProject.images
                                        .filter(img => !deletedImageIds.includes(img.id))
                                        .map(img => (
                                            <div key={img.id} className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 group">
                                                <img src={getApiImageUrl((img as any).image) || ''} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <button type="button" onClick={() => removeExistingImage(img.id)} className="bg-red-500 text-white p-3 rounded-xl shadow-2xl hover:bg-red-600">
                                                        <MdClose size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-white/5 rounded-[3rem] p-16 cursor-pointer hover:border-[#f6423a]/50 hover:bg-white/10 transition-all group">
                                <MdCloudUpload size={48} className="text-gray-600 group-hover:text-[#f6423a] transition-colors mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Drop high-res images here</span>
                                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>

                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {previews.map((preview, i) => (
                                        <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border border-[#f6423a]/20">
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeFile(i)} className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full"><MdClose size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-8 max-w-4xl">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Meta Title</label>
                                <input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#f6423a]" placeholder="Showcase SEO Title" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Meta Description</label>
                                <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#f6423a] resize-none" placeholder="Brief SEO description" />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/5">
                        <button type="button" onClick={() => router.push('/dashboard/portfolio')} className="flex-1 py-4 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 rounded-2xl">Discard Changes</button>
                        <button type="submit" disabled={submitting} className="flex-2 bg-[#f6423a] text-white py-4 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-900/20 disabled:opacity-50">
                            {submitting ? 'Archiving Legacy...' : isNew ? 'Establish Showcase' : 'Seal Showcase'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
