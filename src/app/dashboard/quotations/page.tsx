'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchQuotations } from '@/utils/lib/redux/features/products/productSlice';
import DataTable from '@/components/dashboard/DataTable';
import { useToast, ToastContainer } from '@/components/toast';
import axiosInstance from '@/utils/lib/axios/axiosInstance';
import { MdDescription, MdCheckCircle, MdCancel, MdPending, MdClose } from 'react-icons/md';
import StatCard from '@/components/dashboard/StatCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QuotationsPage() {
    const dispatch = useDispatch();
    const { quotations, quotationsLoading: loading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadQuotations();
    }, []);

    const loadQuotations = async () => {
        try {
            await dispatch(fetchQuotations() as any);
        } catch (error: any) {
            showError('Failed to load quotations');
        }
    };

    const handleView = (quotation: any) => {
        router.push(`/dashboard/quotations/${quotation.id}`);
    };

    const columns = [
        { key: 'id', label: 'ID' },
        {
            key: 'project_title',
            label: 'Project Title',
            render: (value: string, row: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-white">{value}</span>
                    <span className="text-xs text-gray-400">{row.product_name || 'General Inquiry'}</span>
                </div>
            )
        },
        {
            key: 'customer',
            label: 'Customer',
            render: (value: any, row: any) => row.user_name || row.guest_name || 'N/A'
        },
        {
            key: 'created_at',
            label: 'Date',
            render: (value: string) => new Date(value).toLocaleDateString()
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${value === 'pending' ? 'border-yellow-500/50 text-yellow-400' :
                    value === 'approved' ? 'border-green-500/50 text-green-400' :
                        value === 'rejected' ? 'border-red-500/50 text-red-400' :
                            'border-gray-500/50 text-gray-400'
                    }`}>
                    {value?.toUpperCase() || 'PENDING'}
                </span>
            )
        }
    ];

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-[#f6423a]">Quotation Requests</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Quotation Requests</h1>
                        <p className="text-gray-400">Manage customer quotation requests</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        title="Pending"
                        value={quotations.filter(q => q.status === 'pending').length}
                        icon={<MdPending />}
                        accent
                    />
                    <StatCard
                        title="Approved"
                        value={quotations.filter(q => q.status === 'approved').length}
                        icon={<MdCheckCircle className="text-green-400" />}
                    />
                    <StatCard
                        title="Rejected"
                        value={quotations.filter(q => q.status === 'rejected').length}
                        icon={<MdCancel className="text-red-400" />}
                    />
                </div>

                <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                    <DataTable
                        columns={columns}
                        data={quotations}
                        loading={loading}
                        onView={handleView}
                    />
                </div>
            </div>
        </>
    );
}