'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '@/utils/lib/redux/features/products/productSlice';
import DataTable from '@/components/dashboard/DataTable';
import { useToast, ToastContainer } from '@/components/toast';
import { ButtonLoading } from '@/components/Loading';
import { MdAdd, MdClose, MdCategory, MdSearch, MdCloudUpload, MdGridView, MdTableRows } from 'react-icons/md';
import { getApiImageUrl } from '@/utils/imageUrl';
import CategoryCard from '@/components/dashboard/categories/CategoryCard';

export default function CategoriesPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { categories, categoriesLoading: loading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    // UI State
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
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
        dispatch(fetchCategories() as any);
    }, [dispatch]);

    const handleEdit = (category: any) => {
        router.push(`/dashboard/categories/${category.id}`);
    };

    const handleDelete = async (category: any) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await dispatch(deleteCategory(category.id) as any).unwrap();
            showSuccess('Category deleted successfully');
        } catch (error: any) {
            showError(error || 'Failed to delete category');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
            setImageRemoved(false); // New image selected, so it's not removed
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
            }

            await dispatch(createCategory(formDataToSend) as any).unwrap();
            showSuccess('Category created successfully');

            setShowModal(false);
            resetForm();
        } catch (error: any) {
            console.error('Submit error:', error);
            showError(typeof error === 'string' ? error : 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            image: null
        });
        setPreviewImage(null);
        setImageRemoved(false);
    };

    // Filter Logic
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'image',
            label: 'Image',
            render: (value: string) => {
                const imgUrl = getApiImageUrl(value);
                return value ? (
                    <img src={imgUrl} alt="Category" className="w-12 h-12 object-cover rounded-lg bg-white/5" />
                ) : (
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 border border-white/5">
                        <MdCategory size={24} />
                    </div>
                );
            }
        },
        { key: 'name', label: 'Name' },
        {
            key: 'description',
            label: 'Description',
            render: (v: string) => <span className="text-gray-400 text-sm line-clamp-1">{v || '—'}</span>
        },
        {
            key: 'product_count',
            label: 'Products',
            render: (value: number) => (
                <span className="bg-[#f6423a]/10 text-[#f6423a] px-3 py-1 rounded-full text-xs font-bold">
                    {value || 0}
                </span>
            )
        }
    ];

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                            <span className="text-gray-600">/</span>
                            <Link
                                href="/dashboard/categories"
                                onClick={(e) => {
                                    if (showModal) {
                                        e.preventDefault();
                                        setShowModal(false);
                                        resetForm();
                                    }
                                }}
                                className={`transition ${showModal ? 'hover:text-white' : 'text-[#f6423a]'}`}
                            >
                                Categories
                            </Link>
                            {showModal && (
                                <>
                                    <span className="text-gray-600">/</span>
                                    <span className="text-[#f6423a] animate-fadeIn">
                                        {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
                                    </span>
                                </>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            {showModal && editingCategory ? 'Edit Category' : showModal ? 'Create Category' : 'Categories'}
                        </h1>
                        <p className="text-sm text-gray-400">
                            {showModal ? 'Adjust the details of your category' : 'Manage your product organization'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#111e48] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#f6423a] w-full md:w-64 transition placeholder-gray-500"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="bg-[#111e48] border border-white/10 rounded-lg p-1 flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-[#f6423a] text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Grid View"
                            >
                                <MdGridView size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-md transition ${viewMode === 'table' ? 'bg-[#f6423a] text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Table View"
                            >
                                <MdTableRows size={20} />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="bg-[#f6423a] hover:bg-[#e03229] text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm shadow-lg shadow-red-900/20 whitespace-nowrap"
                        >
                            <MdAdd size={20} />
                            Add Category
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === 'grid' ? (
                    filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCategories.map(category => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500 bg-[#111e48]/40 backdrop-blur-xl rounded-2xl border border-white/10">
                            <MdCategory size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No categories found matching your criteria.</p>
                        </div>
                    )
                ) : (
                    <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={filteredCategories}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111e48] rounded-2xl p-0 max-w-lg w-full border border-white/10 shadow-2xl overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a1642]">
                            <h2 className="text-xl font-bold text-white">Add New Category</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-[#0e1736]">
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
                                    className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition resize-none text-sm"
                                    rows={3}
                                    placeholder="Brief category description..."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Category Image</label>
                                <div className="space-y-3">
                                    <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 transition hover:border-[#f6423a]/50 hover:bg-[#f6423a]/5 group text-center cursor-pointer bg-[#0a1642]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#f6423a] transition">
                                            <MdCloudUpload size={28} />
                                            <p className="font-semibold text-sm text-white">Click to upload image</p>
                                            <p className="text-[10px] text-gray-500 uppercase">WEBP, PNG, JPG (Max 5MB)</p>
                                        </div>
                                    </div>

                                    {previewImage && (
                                        <div className="bg-[#050b2b] rounded-xl p-3 border border-white/10 flex items-center gap-4 animate-fadeIn">
                                            <img src={previewImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-xs font-bold truncate">{formData.image?.name || 'Current Image'}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, image: null });
                                                        setPreviewImage(null);
                                                        setImageRemoved(true);
                                                    }}
                                                    className="text-[#f6423a] text-[10px] font-bold uppercase mt-1 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold px-6 py-3 rounded-xl transition text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#f6423a] hover:bg-[#e03229] text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-red-900/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                                >
                                    {submitting ? <ButtonLoading /> : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
