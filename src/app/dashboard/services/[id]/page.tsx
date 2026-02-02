'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import {
    fetchStoreServices,
    updateStoreService,
    createStoreService,
    StoreService
} from '@/utils/lib/redux/features/management/managementSlice';
import { useToast, ToastContainer } from '@/components/toast';
import { MdArrowBack, MdInfo, MdSearch, MdCloudUpload, MdClose, MdImage } from 'react-icons/md';
import Link from 'next/link';

// Extended interface to include images
interface ExtendedStoreService extends StoreService {
    images?: Array<{ id: number; image: string; is_primary: boolean }>;
}

export default function ServiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { services, servicesLoading } = useSelector((state: RootState) => state.management);
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
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        focus_keyword: ''
    });

    const isNew = id === 'new';
    const currentService = !isNew ? services.find(s => s.id === parseInt(id as string)) as ExtendedStoreService : null;

    useEffect(() => {
        dispatch(fetchStoreServices() as any);
    }, [dispatch]);

    useEffect(() => {
        if (currentService) {
            setFormData({
                title: currentService.title,
                category: currentService.category,
                description: currentService.description,
                is_active: currentService.is_active,
                meta_title: currentService.meta_title || currentService.title || '',
                meta_description: currentService.meta_description || '',
                meta_keywords: currentService.meta_keywords || '',
                focus_keyword: currentService.focus_keyword || ''
            });
        }
    }, [currentService]);

    useEffect(() => {
        // Cleanup object URLs
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

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
        setPreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]);
            return newPreviews.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (imageId: number) => {
        setDeletedImageIds(prev => [...prev, imageId]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            // Only append primitive values or files. Skip arrays (like 'images') 
            // as they are handled elsewhere or read-only.
            const value = formData[key as keyof typeof formData];
            if (value !== null && typeof value !== 'object' && key !== 'images' && key !== 'upload_images') {
                data.append(key, String(value));
            }
        });

        // Append images
        selectedFiles.forEach(file => {
            data.append('upload_images', file);
        });

        // Append deleted image IDs
        deletedImageIds.forEach(id => {
            data.append('remove_images', id.toString());
        });

        try {
            if (isNew) {
                await dispatch(createStoreService(data) as any).unwrap();
                showSuccess('Service created successfully');
                router.push('/dashboard/services');
            } else {
                await dispatch(updateStoreService({ id: parseInt(id as string), data }) as any).unwrap();
                showSuccess('Service updated successfully');
                dispatch(fetchStoreServices() as any);
                setSelectedFiles([]);
                setPreviews([]);
                setDeletedImageIds([]);
            }
        } catch (err: any) {
            console.error('Service save error:', err);
            let errorMessage = 'Failed to save service';

            if (typeof err === 'object' && err !== null) {
                if (err.message && err.errors) {
                    const errorDetails = Object.values(err.errors).flat().join(', ');
                    errorMessage = `${err.message}: ${errorDetails}`;
                } else if (err.message) {
                    errorMessage = err.message;
                }
            } else if (typeof err === 'string') {
                errorMessage = err;
            }

            showError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (servicesLoading && !isNew) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
            </div>
        );
    }

    if (!isNew && !currentService && !servicesLoading) {
        return (
            <div className="p-8 text-center text-white">
                <h2 className="text-xl font-bold mb-2">Service Not Found</h2>
                <p className="text-red-400 mb-4">The requested service could not be found.</p>
                <Link href="/dashboard/services" className="text-blue-400 hover:underline">Return to Services</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/services" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                    <MdArrowBack size={24} />
                </Link>
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/services" className="hover:text-white transition">Services</Link>
                        <span>/</span>
                        <span className="text-[#f6423a]">{isNew ? 'New Service' : currentService?.title || 'Edit Service'}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">{isNew ? 'Add New Service' : 'Edit Service'}</h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                {/* Tabs */}
                <div className="flex bg-[#050b2b] p-1 border-b border-white/5">
                    <button
                        type="button"
                        onClick={() => setActiveTab('basic')}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'basic' ? 'bg-[#f6423a] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        Basic Info
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('images')}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'images' ? 'bg-[#f6423a] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        Gallery Images
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('seo')}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'seo' ? 'bg-[#f6423a] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        SEO Settings
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Service Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition"
                                    placeholder="e.g., Gates & Shutters"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition"
                                    placeholder="e.g., Fabrication"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition resize-none"
                                    placeholder="Describe the service..."
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded bg-[#050b2b] border-white/10 text-[#f6423a] focus:ring-[#f6423a]"
                                />
                                <label className="text-sm text-gray-300 font-medium">
                                    Active (visible to customers)
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="space-y-8">
                            {/* Existing Images */}
                            {currentService?.images && currentService.images.length > 0 && (
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                                        Current Images
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {currentService.images
                                            .filter(img => !deletedImageIds.includes(img.id))
                                            .map((img) => (
                                                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                                    <img
                                                        src={img.image}
                                                        alt="Service"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(img.id)}
                                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                                                            title="Remove Image"
                                                        >
                                                            <MdClose size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                                    Upload New Images
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {/* Preview Uploads */}
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                            >
                                                <MdClose size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Trigger */}
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#f6423a]/50 transition cursor-pointer flex flex-col items-center justify-center gap-2 group">
                                        <MdCloudUpload size={32} className="text-gray-500 group-hover:text-[#f6423a] transition" />
                                        <span className="text-xs text-gray-500 font-medium group-hover:text-gray-300">Add Images</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    You can select multiple images at once.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-6">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                <MdInfo className="text-blue-400 shrink-0 mt-0.5" size={20} />
                                <p className="text-xs text-blue-300 leading-relaxed">
                                    Optimize your service for search engines. Meta title and description appear in Google search results.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                    maxLength={60}
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition"
                                    placeholder="SEO-optimized title (60 chars max)"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    maxLength={160}
                                    rows={3}
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition resize-none"
                                    placeholder="Brief description for search results (160 chars max)"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160 characters</p>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Focus Keyword
                                </label>
                                <input
                                    type="text"
                                    name="focus_keyword"
                                    value={formData.focus_keyword}
                                    onChange={handleChange}
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition"
                                    placeholder="Primary keyword to rank for"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                    Meta Keywords
                                </label>
                                <input
                                    type="text"
                                    name="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={handleChange}
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition"
                                    placeholder="Comma-separated keywords"
                                />
                            </div>

                            {/* Google Search Preview */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Google Search Preview</p>
                                <div className="space-y-2">
                                    <h3 className="text-blue-400 text-lg font-medium hover:underline cursor-pointer">
                                        {formData.meta_title || formData.title || 'Service Title'}
                                    </h3>
                                    <p className="text-green-600 text-xs">
                                        bhattaraimetalworks.com › services › {formData.title.toLowerCase().replace(/\s+/g, '-') || 'service-name'}
                                    </p>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {formData.meta_description || formData.description || 'Service description will appear here in search results...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/services')}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-[#f6423a] hover:bg-[#e03229] text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Saving...' : isNew ? 'Create Service' : 'Update Service'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
