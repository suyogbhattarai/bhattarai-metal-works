'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchBookings } from '@/utils/lib/redux/features/products/productSlice';
import DataTable from '@/components/dashboard/DataTable';
import { useToast, ToastContainer } from '@/components/toast';
import axiosInstance from '@/utils/lib/axios/axiosInstance';
import { MdClose } from 'react-icons/md';

export default function BookingsPage() {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state: RootState) => state.products);
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            await dispatch(fetchBookings() as any);
        } catch (error: any) {
            showError('Failed to load bookings');
        }
    };

    const handleView = (booking: any) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleStatusUpdate = async (bookingId: number, status: string) => {
        setUpdating(true);
        try {
            await axiosInstance.patch(`/products/bookings/${bookingId}/`, { status });
            showSuccess(`Booking ${status} successfully`);
            loadBookings();
            setShowModal(false);
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        {
            key: 'service',
            label: 'Service',
            render: (value: string) => value || 'Service Booking'
        },
        {
            key: 'customer',
            label: 'Customer',
            render: (value: any, row: any) => value?.name || row.customer_name || 'N/A'
        },
        {
            key: 'preferred_date',
            label: 'Date',
            render: (value: string) => new Date(value).toLocaleDateString()
        },
        {
            key: 'preferred_time',
            label: 'Time'
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${value === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    value === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        value === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                            value === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
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
                    <h1 className="text-3xl font-bold text-white mb-2">Service Bookings</h1>
                    <p className="text-gray-400">Manage customer service appointments</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm font-medium mb-1">Pending</p>
                        <p className="text-3xl font-bold text-white">
                            {bookings.filter(b => b.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <p className="text-green-400 text-sm font-medium mb-1">Confirmed</p>
                        <p className="text-3xl font-bold text-white">
                            {bookings.filter(b => b.status === 'confirmed').length}
                        </p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-blue-400 text-sm font-medium mb-1">Completed</p>
                        <p className="text-3xl font-bold text-white">
                            {bookings.filter(b => b.status === 'completed').length}
                        </p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-400 text-sm font-medium mb-1">Cancelled</p>
                        <p className="text-3xl font-bold text-white">
                            {bookings.filter(b => b.status === 'cancelled').length}
                        </p>
                    </div>
                </div>

                <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                    <DataTable
                        columns={columns}
                        data={bookings}
                        loading={loading}
                        onView={handleView}
                    />
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111e48] rounded-xl p-6 max-w-2xl w-full border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 text-sm">Service Type</p>
                                <p className="text-white font-semibold text-lg">{selectedBooking.service || 'Service Booking'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Customer Name</p>
                                    <p className="text-white">{selectedBooking.customer?.name || selectedBooking.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Contact</p>
                                    <p className="text-white">{selectedBooking.contact_number}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm">Email</p>
                                <p className="text-white">{selectedBooking.contact_email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Preferred Date</p>
                                    <p className="text-white">{new Date(selectedBooking.preferred_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Preferred Time</p>
                                    <p className="text-white">{selectedBooking.preferred_time}</p>
                                </div>
                            </div>

                            {selectedBooking.address && (
                                <div>
                                    <p className="text-gray-400 text-sm">Address</p>
                                    <p className="text-white">{selectedBooking.address}</p>
                                </div>
                            )}

                            {selectedBooking.notes && (
                                <div>
                                    <p className="text-gray-400 text-sm">Notes</p>
                                    <p className="text-white">{selectedBooking.notes}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-gray-400 text-sm mb-2">Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedBooking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                    selectedBooking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                        selectedBooking.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {selectedBooking.status?.toUpperCase() || 'PENDING'}
                                </span>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                {selectedBooking.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                                        disabled={updating}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                                    >
                                        Confirm
                                    </button>
                                )}
                                {selectedBooking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                                        disabled={updating}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                                    >
                                        Mark Complete
                                    </button>
                                )}
                                {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                                        disabled={updating}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
