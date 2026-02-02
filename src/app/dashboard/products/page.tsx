'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchProducts, deleteProduct, createProduct } from '@/utils/lib/redux/features/products/productSlice';
import { fetchCategories } from '@/utils/lib/redux/features/products/productSlice';
import DataTable from '@/components/dashboard/DataTable';
import { useToast, ToastContainer } from '@/components/toast';
import { MdAdd, MdGridView, MdTableRows, MdSearch, MdInventory } from 'react-icons/md';
import ProductCard from '@/components/dashboard/products/ProductCard';
import ProductModal from '@/components/dashboard/products/ProductModal';
import { getApiImageUrl } from '@/utils/imageUrl';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { products, categories, productsLoading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    // UI State
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            await dispatch(fetchProducts({}) as any);
            await dispatch(fetchCategories() as any);
        } catch (error: any) {
            showError('Failed to load products');
        }
    };

    const handleEdit = (product: any) => {
        // Navigate to details page
        router.push(`/dashboard/products/${product.slug}`);
    };

    const handleDelete = async (product: any) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await dispatch(deleteProduct(product.slug) as any).unwrap();
            showSuccess('Product deleted successfully');
            loadData();
        } catch (error: any) {
            showError(error || 'Failed to delete product');
        }
    };

    const handleCreateSubmit = async (formData: FormData) => {
        setSubmitting(true);
        try {
            await dispatch(createProduct(formData) as any).unwrap();
            showSuccess('Product created successfully');
            setShowCreateModal(false);
            loadData();
        } catch (error: any) {
            console.error(error);
            if (error && typeof error === 'object') {
                const messages = Object.entries(error).map(([key, value]) => {
                    const msg = Array.isArray(value) ? value.join(' ') : value;
                    return `${key}: ${msg}`;
                }).join('\n');
                showError(messages || 'Failed to save product');
            } else {
                showError(typeof error === 'string' ? error : 'Failed to save product.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof p.category === 'object' && (p.category as any).name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (typeof p.category === 'string' && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' ||
            (typeof p.category === 'object' && (p.category as any).name === selectedCategory) ||
            p.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const columns = [
        {
            key: 'primary_image',
            label: 'Image',
            render: (value: string) => {
                const imgUrl = getApiImageUrl(value);
                return value ? (
                    <img src={imgUrl} alt="Product" className="w-10 h-10 object-cover rounded-md bg-white/5" />
                ) : (
                    <div className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center text-gray-400">
                        <MdInventory size={20} />
                    </div>
                );
            }
        },
        { key: 'name', label: 'Name' },
        {
            key: 'category',
            label: 'Category',
            render: (value: any) => typeof value === 'object' ? value.name : value
        },
        {
            key: 'base_price',
            label: 'Price',
            render: (value: string) => `$${value}`
        },
        {
            key: 'is_featured',
            label: 'Featured',
            render: (value: boolean) => (
                <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {value ? 'Yes' : 'No'}
                </span>
            )
        },
        {
            key: 'is_in_stock',
            label: 'Status',
            render: (value: boolean) => (
                <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                    {value ? 'In Stock' : 'Out of Stock'}
                </span>
            )
        }
    ];

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">

                {/* Header & Controls */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                                <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                                <span className="text-gray-600">/</span>
                                <span className="text-[#f6423a]">Products</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">Products</h1>
                            <p className="text-sm text-gray-400">Manage your product catalog</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-[#111e48] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#f6423a] w-64 transition placeholder-gray-500"
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
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[#f6423a] hover:bg-[#e03229] text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm shadow-lg shadow-red-900/20"
                            >
                                <MdAdd size={18} />
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap border ${selectedCategory === 'All'
                                ? 'bg-white text-[#0a1642] border-white'
                                : 'bg-[#111e48] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            All Products
                        </button>
                        {categories.map((cat: any) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap border ${selectedCategory === cat.name
                                    ? 'bg-white text-[#0a1642] border-white'
                                    : 'bg-[#111e48] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111e48] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#f6423a]"
                        />
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'grid' ? (
                    filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <MdInventory size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No products found matching your criteria.</p>
                        </div>
                    )
                ) : (
                    <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                        <DataTable
                            columns={columns}
                            data={filteredProducts}
                            loading={productsLoading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <ProductModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateSubmit}
                    // No product prop = Create mode
                    categories={categories}
                    submitting={submitting}
                />
            )}
        </>
    );
}