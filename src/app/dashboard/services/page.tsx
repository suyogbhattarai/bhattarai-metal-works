'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/utils/lib/redux/Store';
import {
    fetchStoreServices,
    deleteStoreService,
    StoreService
} from '@/utils/lib/redux/features/management/managementSlice';
import { MdAdd, MdEngineering, MdEdit, MdDelete, MdCheckCircle, MdCancel, MdHandyman } from 'react-icons/md';
import { useToast, ToastContainer } from '@/components/toast';
import { ServiceCardSkeleton } from '@/components/Skeletons';
import Link from 'next/link';

export default function ServicesPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { services, servicesLoading, error } = useSelector((state: RootState) => state.management);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    useEffect(() => {
        dispatch(fetchStoreServices() as any);
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await dispatch(deleteStoreService(id) as any).unwrap();
            showSuccess('Service deleted successfully');
        } catch (err: any) {
            showError(err || 'Failed to delete service');
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Breadcrumb */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#f6423a]">Services</span>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-white">Services</h1>
                        <p className="text-gray-500 text-sm font-medium">Manage corporate service offerings.</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/services/new')}
                        className="bg-[#f6423a] text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#e03229] transition-all shadow-lg shadow-red-900/20"
                    >
                        <MdAdd size={20} /> Add Service
                    </button>
                </div>
            </div>

            {servicesLoading ? (
                <ServiceCardSkeleton />
            ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div
                            key={service.id}
                            onClick={() => router.push(`/dashboard/services/${service.id}`)}
                            className="group relative bg-[#111e48] rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-[#f6423a]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[#f6423a]/5 flex flex-col cursor-pointer"
                        >
                            {/* Image Area */}
                            <div className="aspect-[16/10] bg-[#0a1642] relative overflow-hidden">
                                {/* Status Flag */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-1.5 ${service.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${service.is_active ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {/* Action Buttons Overlay */}
                                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/dashboard/services/${service.id}`);
                                        }}
                                        className="p-2.5 rounded-xl bg-white/10 hover:bg-[#f6423a] text-white backdrop-blur-md transition-all duration-300 border border-white/10 shadow-lg"
                                        title="Edit"
                                    >
                                        <MdEdit size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(service.id);
                                        }}
                                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-white backdrop-blur-md transition-all duration-300 border border-red-500/20 shadow-lg"
                                        title="Delete"
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>

                                {(service as any).images?.length > 0 ? (
                                    <img
                                        src={(service as any).images[0].image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (service as any).image ? (
                                    <img
                                        src={(service as any).image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                        <MdHandyman size={48} className="mb-2 opacity-20" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">No Preview Available</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1642] via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-[#f6423a] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                                        {service.category || 'General'}
                                    </span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-7 flex-1 flex flex-col bg-gradient-to-b from-transparent to-[#0a1642]/30">
                                <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#f6423a] transition-colors duration-300">
                                    {service.title}
                                </h3>

                                <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 mb-6 group-hover:text-gray-400 transition-colors">
                                    {service.description || 'Professional metal fabrication service for industrial and residential needs.'}
                                </p>

                                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#f6423a]" />
                                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Service ID: {service.id}</span>
                                    </div>
                                    <div className="text-[10px] text-[#f6423a] font-black uppercase tracking-widest underline decoration-[#f6423a]/30 decoration-2 underline-offset-4">
                                        Configure Details
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="col-span-full py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                    <MdEngineering size={64} className="mx-auto text-gray-800 mb-6" />
                    <p className="text-gray-400 font-medium italic">No services registered yet.</p>
                </div>
            )}
        </div>
    );
}
