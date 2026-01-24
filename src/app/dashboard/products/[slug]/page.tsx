'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchProductDetail, updateProduct, fetchCategories, clearCurrentProduct } from '@/utils/lib/redux/features/products/productSlice';
import ProductForm from '@/components/dashboard/products/ProductForm';
import { useToast, ToastContainer } from '@/components/toast';
import { MdArrowBack } from 'react-icons/md';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentProduct, currentProductLoading, currentProductError, categories } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (slug) {
            dispatch(fetchProductDetail(slug as string) as any);
            dispatch(fetchCategories() as any);
        }
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, slug]);

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        try {
            await dispatch(updateProduct({ slug: slug as string, data: formData }) as any).unwrap();
            showSuccess('Product updated successfully');
            // Optional: Refresh data
            dispatch(fetchProductDetail(slug as string) as any);
        } catch (error: any) {
            console.error(error);
            if (error && typeof error === 'object') {
                const messages = Object.entries(error).map(([key, value]) => {
                    const msg = Array.isArray(value) ? value.join(' ') : value;
                    return `${key}: ${msg}`;
                }).join('\n');
                showError(messages || 'Failed to update product');
            } else {
                showError(typeof error === 'string' ? error : 'Failed to update product');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (currentProductLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
            </div>
        );
    }

    if (currentProductError) {
        return (
            <div className="p-8 text-center text-white">
                <h2 className="text-xl font-bold mb-2">Error Loading Product</h2>
                <p className="text-red-400 mb-4">{currentProductError}</p>
                <Link href="/dashboard/products" className="text-blue-400 hover:underline">Return to Products</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/products" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                    <MdArrowBack size={24} />
                </Link>
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/products" className="hover:text-white transition">Products</Link>
                        <span>/</span>
                        <span className="text-[#f6423a]">{currentProduct?.name || 'Edit Product'}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Edit Product</h1>
                </div>
            </div>

            {currentProduct && (
                <ProductForm
                    initialData={currentProduct}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    categories={categories}
                    onCancel={() => router.push('/dashboard/products')}
                />
            )}
        </div>
    );
}
