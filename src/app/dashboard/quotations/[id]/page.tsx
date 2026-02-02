'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchQuotations } from '@/utils/lib/redux/features/products/productSlice';
import axiosInstance from '@/utils/lib/axios/axiosInstance';
import { useToast, ToastContainer } from '@/components/toast';
import {
    MdArrowBack,
    MdDescription,
    MdPending,
    MdCheckCircle,
    MdCancel,
    MdPerson,
    MdEmail,
    MdPhone,
    MdWork,
    MdCategory,
    MdInventory
} from 'react-icons/md';
import Link from 'next/link';

export default function QuotationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { quotations, quotationsLoading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    // If not found in store, we might want to fetch it individually or rely on list
    // simplified: rely on list for now, but handle direct access by ensuring list is loaded
    const quotation = quotations.find(q => q.id === parseInt(id as string));

    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (quotations.length === 0) {
            dispatch(fetchQuotations() as any);
        }
    }, [dispatch, quotations.length]);

    const handleStatusUpdate = async (status: string) => {
        if (!quotation) return;
        setUpdating(true);
        try {
            await axiosInstance.patch(`/products/quotations/${quotation.id}/`, { status });
            showSuccess(`Quotation ${status} successfully`);
            dispatch(fetchQuotations() as any); // Refresh list
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (quotationsLoading && !quotation) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
            </div>
        );
    }

    if (!quotation && !quotationsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
                <h2 className="text-2xl font-bold mb-4">Quotation Not Found</h2>
                <Link href="/dashboard/quotations" className="text-[#f6423a] hover:underline">
                    Return to Quotations
                </Link>
            </div>
        );
    }

    if (!quotation) return null; // Should not happen given above guards

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <MdCheckCircle />;
            case 'rejected': return <MdCancel />;
            default: return <MdPending />;
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-fadeIn">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/quotations" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                    <MdArrowBack size={24} />
                </Link>
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/quotations" className="hover:text-white transition">Quotations</Link>
                        <span>/</span>
                        <span className="text-[#f6423a] font-mono">#{quotation.id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white">Quotation Request</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusColor(quotation.status)}`}>
                            {getStatusIcon(quotation.status)}
                            {quotation.status || 'PENDING'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Project Details */}
                    <div className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
                            <MdWork className="text-[#f6423a]" size={20} />
                            Project Requirements
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Project Title</p>
                                <p className="text-xl font-bold text-white">{quotation.project_title}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Service Type</p>
                                <div className="flex items-center gap-2 text-white">
                                    <MdCategory className="text-gray-400" />
                                    <span className="font-medium">{quotation.service_type || 'General Service'}</span>
                                </div>
                            </div>
                            {quotation.product_name && (
                                <div className="col-span-full">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Related Product</p>
                                    <p className="flex items-center gap-2 text-blue-400 font-medium bg-blue-400/10 px-4 py-2 rounded-xl inline-block border border-blue-400/20">
                                        <MdInventory />
                                        {quotation.product_name}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Description & Scope</p>
                            <div className="bg-[#050b2b]/50 p-6 rounded-2xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {quotation.description}
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    {quotation.attachments && quotation.attachments.length > 0 && (
                        <div className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
                                <MdDescription className="text-[#f6423a]" size={20} />
                                Attachments ({quotation.attachments.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quotation.attachments.map((file: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={file.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition group"
                                    >
                                        <div className="w-10 h-10 bg-[#f6423a]/10 rounded-lg flex items-center justify-center text-[#f6423a]">
                                            <MdDescription size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-bold truncate">{file.file_name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold group-hover:text-blue-400 transition">Download / View</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
                            <MdPerson className="text-[#f6423a]" size={20} />
                            Customer Details
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                    {(quotation.user_name || quotation.guest_name || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">{quotation.user_name || quotation.guest_name}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{quotation.user_name ? 'Registered User' : 'Guest User'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                        <MdEmail />
                                    </div>
                                    <span className="text-gray-300">{quotation.guest_email || 'Email linked to account'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                        <MdPhone />
                                    </div>
                                    <span className="text-gray-300">{quotation.guest_phone || 'No phone provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {quotation.status === 'pending' && (
                        <div className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleStatusUpdate('approved')}
                                    disabled={updating}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <MdCheckCircle size={20} />
                                    Approve Request
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('rejected')}
                                    disabled={updating}
                                    className="w-full bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <MdCancel size={20} />
                                    Reject Request
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
