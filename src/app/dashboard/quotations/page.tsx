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

export default function QuotationsPage() {
    const dispatch = useDispatch();
    const { quotations, loading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);

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
        setSelectedQuotation(quotation);
        setShowModal(true);
    };

    const handleStatusUpdate = async (quotationId: number, status: string) => {
        setUpdating(true);
        try {
            await axiosInstance.patch(`/products/quotations/${quotationId}/`, { status });
            showSuccess(`Quotation ${status} successfully`);
            loadQuotations();
            setShowModal(false);
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'project_title', label: 'Project Title' },
        {
            key: 'customer',
            label: 'Customer',
            render: (value: any, row: any) => value?.name || row.customer_name || 'N/A'
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
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Quotation Requests</h1>
                    <p className="text-gray-400">Manage customer quotation requests</p>
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

            {/* Detail Modal */}
            {showModal && selectedQuotation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111e48] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Quotation Details</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 text-sm">Project Title</p>
                                <p className="text-white font-semibold text-lg">{selectedQuotation.project_title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Customer Name</p>
                                    <p className="text-white">{selectedQuotation.customer?.name || selectedQuotation.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Contact</p>
                                    <p className="text-white">{selectedQuotation.contact_number}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm">Email</p>
                                <p className="text-white">{selectedQuotation.contact_email}</p>
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm">Project Description</p>
                                <p className="text-white">{selectedQuotation.project_description}</p>
                            </div>

                            {selectedQuotation.requirements && (
                                <div>
                                    <p className="text-gray-400 text-sm">Requirements</p>
                                    <p className="text-white">{selectedQuotation.requirements}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Timeline</p>
                                    <p className="text-white">{selectedQuotation.timeline || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Budget Range</p>
                                    <p className="text-white">{selectedQuotation.budget_range || 'Not specified'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm mb-2">Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedQuotation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                    selectedQuotation.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                        selectedQuotation.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {selectedQuotation.status?.toUpperCase() || 'PENDING'}
                                </span>
                            </div>

                            {selectedQuotation.status === 'pending' && (
                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedQuotation.id, 'approved')}
                                        disabled={updating}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedQuotation.id, 'rejected')}
                                        disabled={updating}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}