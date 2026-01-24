'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchCategories } from '@/utils/lib/redux/features/products/productSlice';
import DataTable from '@/components/dashboard/DataTable';
import { useToast, ToastContainer } from '@/components/toast';
import axiosInstance from '@/utils/lib/axios/axiosInstance';
import { ButtonLoading } from '@/components/Loading';
import { MdAdd, MdClose, MdCategory } from 'react-icons/md';

export default function CategoriesPage() {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null as File | null
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            await dispatch(fetchCategories() as any);
        } catch (error: any) {
            showError('Failed to load categories');
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            image: null
        });
        setShowModal(true);
    };

    const handleDelete = async (category: any) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await axiosInstance.delete(`/products/categories/${category.id}/`);
            showSuccess('Category deleted successfully');
            loadCategories();
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to delete category');
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

            if (editingCategory) {
                await axiosInstance.put(`/products/categories/${editingCategory.id}/`, formDataToSend);
                showSuccess('Category updated successfully');
            } else {
                await axiosInstance.post('/products/categories/', formDataToSend);
                showSuccess('Category created successfully');
            }

            setShowModal(false);
            resetForm();
            loadCategories();
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to save category');
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
        setEditingCategory(null);
    };

    const columns = [
        {
            key: 'image',
            label: 'Image',
            render: (value: string) => value ? (
                <img src={value} alt="Category" className="w-12 h-12 object-cover rounded-lg" />
            ) : (
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
                    <MdCategory size={24} />
                </div>
            )
        },
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        {
            key: 'products_count',
            label: 'Products',
            render: (value: number) => value || 0
        }
    ];

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
                        <p className="text-gray-400">Organize your products by categories</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-[#f6423a] hover:bg-[#e03229] text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2"
                    >
                        <MdAdd size={24} />
                        Add Category
                    </button>
                </div>

                <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                    <DataTable
                        columns={columns}
                        data={categories}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111e48] rounded-xl p-6 max-w-lg w-full border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Category Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0a1642] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f6423a]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#0a1642] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f6423a]"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Category Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                    className="w-full bg-[#0a1642] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f6423a]"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#f6423a] hover:bg-[#e03229] text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                                >
                                    {submitting ? <ButtonLoading text="Saving..." /> : editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}