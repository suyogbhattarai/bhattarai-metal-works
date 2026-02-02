'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchCategoryDetail, updateCategory } from '@/utils/lib/redux/features/products/productSlice';
import { useToast, ToastContainer } from '@/components/toast';
import { MdArrowBack, MdCloudUpload, MdCategory, MdCheck } from 'react-icons/md';
import Link from 'next/link';
import { getApiImageUrl } from '@/utils/imageUrl';
import { ButtonLoading } from '@/components/Loading';

export default function CategoryEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { categories, categoriesLoading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    // Find the category in store or it will be fetched
    const categoryId = parseInt(id as string);
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null as File | null
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageRemoved, setImageRemoved] = useState(false);

    useEffect(() => {
        const loadCategory = async () => {
            setLoading(true);
            try {
                const result = await dispatch(fetchCategoryDetail(categoryId) as any).unwrap();
                setCurrentCategory(result);
                setFormData({
                    name: result.name || '',
                    description: result.description || '',
                    image: null
                });
                setPreviewImage(result.image ? getApiImageUrl(result.image) : null);
            } catch (error: any) {
                showError(error || 'Failed to load category details');
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            loadCategory();
        }
    }, [dispatch, categoryId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
            setImageRemoved(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            } else if (imageRemoved) {
                formDataToSend.append('image', '');
            }

            await dispatch(updateCategory({ id: categoryId, data: formDataToSend }) as any).unwrap();
            showSuccess('Category updated successfully');

            // Refresh local data
            const updated = await dispatch(fetchCategoryDetail(categoryId) as any).unwrap();
            setCurrentCategory(updated);
            setPreviewImage(updated.image ? getApiImageUrl(updated.image) : null);
            setImageRemoved(false);
            setFormData(prev => ({ ...prev, image: null }));

        } catch (error: any) {
            showError(typeof error === 'string' ? error : 'Failed to update category');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 animate-fadeIn">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/dashboard/categories')}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition border border-white/5 shadow-lg"
                >
                    <MdArrowBack size={24} />
                </button>
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1 font-medium">
                        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                        <span className="text-gray-600">/</span>
                        <Link href="/dashboard/categories" className="hover:text-white transition">Categories</Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-[#f6423a]">{currentCategory?.name || 'Edit'}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Edit Category</h1>
                </div>
            </div>

            {/* Main Form Content */}
            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Info Section */}
                    <div className="bg-[#111e48] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-white/5 bg-[#0a1642] flex items-center justify-between">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">General Information</h3>
                            <span className="text-[10px] text-gray-500 font-mono">ID: {currentCategory?.id}</span>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Category Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition text-sm font-medium"
                                        placeholder="e.g. Traditional Railings"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition resize-none text-sm min-h-[120px]"
                                        placeholder="Brief category description..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="bg-[#111e48] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-white/5 bg-[#0a1642]">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Category Media</h3>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Upload Box */}
                                <div className="space-y-4">
                                    <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Change Image</label>
                                    <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-10 transition hover:border-[#f6423a]/50 hover:bg-[#f6423a]/5 group text-center cursor-pointer bg-[#050b2b]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-[#f6423a] transition">
                                            <MdCloudUpload size={40} />
                                            <div>
                                                <p className="font-bold text-white">Click to upload brand new image</p>
                                                <p className="text-xs text-gray-500 mt-1 uppercase">Support webp, png, jpg (Max 5MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview / Current */}
                                <div className="space-y-4">
                                    <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Image Status</label>
                                    {previewImage ? (
                                        <div className="bg-[#050b2b] rounded-2xl p-4 border border-white/10 relative group">
                                            <div className="aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 relative">
                                                <img src={previewImage} alt="Category" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border border-white/20">
                                                        {formData.image ? 'New Selection' : 'Current Image'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                                                    {formData.image ? formData.image.name : 'Stored Category Image'}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => { setFormData({ ...formData, image: null }); setPreviewImage(null); setImageRemoved(true); }}
                                                    className="text-[#f6423a] text-xs font-bold uppercase hover:underline"
                                                >
                                                    Remove Media
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#050b2b] rounded-2xl p-10 border border-white/5 flex flex-col items-center justify-center text-gray-600 border-dashed">
                                            <MdCategory size={48} className="opacity-20 mb-2" />
                                            <p className="text-xs font-bold uppercase tracking-widest">No Category Image</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/categories')}
                            className="px-8 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition font-bold text-sm"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-10 py-3 rounded-xl bg-[#f6423a] hover:bg-[#e03229] text-white font-bold shadow-lg shadow-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {submitting ? <ButtonLoading /> : <MdCheck size={20} />}
                            {submitting ? 'Saving Changes...' : 'Update Category'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
