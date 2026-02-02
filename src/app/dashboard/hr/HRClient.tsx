'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchStaff, fetchAttendance, deleteStaff } from '@/utils/lib/redux/features/management/managementSlice';
import {
    MdPeople,
    MdPayments,
    MdBadge,
    MdFingerprint,
    MdAdd,
    MdVerified,
    MdWarning,
    MdCloudDownload,
    MdSearch,
    MdPersonSearch,
    MdChevronRight,
    MdDelete
} from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import { useToast, ToastContainer } from '@/components/toast';
import Link from 'next/link';

type Tab = 'staff' | 'attendance' | 'payroll';

export default function HRClient() {
    const [activeTab, setActiveTab] = useState<Tab>('staff');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const dispatch = useDispatch();
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const { staff, staffLoading } = useSelector((state: RootState) => state.management);

    useEffect(() => {
        dispatch(fetchStaff() as any);
        dispatch(fetchAttendance() as any);
    }, [dispatch]);

    const tabs = [
        { id: 'staff', label: 'Staff Directory', icon: <MdPeople /> },
        { id: 'attendance', label: 'Attendance', icon: <MdFingerprint /> },
        { id: 'payroll', label: 'Payroll', icon: <MdPayments /> }
    ];

    const getStaffName = (s: any) => {
        if (!s) return 'Unknown';
        if (s.user_name) return s.user_name;
        const details = s.user_data || s.user_details;
        if (details) {
            const { first_name, last_name, username } = details;
            if (first_name || last_name) return `${first_name} ${last_name}`.trim();
            return username || 'Unknown';
        }
        return 'Unknown';
    }

    const filteredStaff = staff.filter(s =>
        getStaffName(s).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.designation || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to remove this staff member? This action cannot be undone.')) {
            try {
                await dispatch(deleteStaff(id) as any).unwrap();
                showSuccess('Staff member removed successfully');
                await dispatch(fetchStaff() as any); // Refresh list
            } catch (error: any) {
                showError('Failed to remove staff');
            }
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#f6423a]">Human Resources</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">HR Management</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-gray-400 text-sm font-medium">System operational - {staff.length} workforce total</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/hr/new')}
                        className="bg-[#f6423a] text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[#e03229] transition-all shadow-xl shadow-red-900/30 group"
                    >
                        <MdAdd size={22} className="group-hover:rotate-90 transition-transform" />
                        Onboard New Staff
                    </button>
                </div>
            </div>

            {/* Controls & Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#111e48]/40 backdrop-blur-xl p-3 border border-white/5 rounded-[2rem]">
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`
                                flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-[#f6423a] text-white shadow-lg shadow-red-900/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-96 group">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#f6423a] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#050b2b]/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#f6423a] transition-all placeholder-gray-600 font-bold"
                    />
                </div>
            </div>

            {/* Content Display */}
            <div className="min-h-[60vh]">
                {activeTab === 'staff' && (
                    <div className="animate-fadeIn">
                        {staffLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-[#111e48]/20 rounded-[3rem] border border-white/5">
                                <FiLoader className="animate-spin text-[#f6423a] mb-6" size={56} />
                                <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">Scanning Workforce Database...</p>
                            </div>
                        ) : filteredStaff.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {filteredStaff.map((member) => (
                                    <div
                                        key={member.id}
                                        onClick={() => router.push(`/dashboard/hr/${member.id}`)}
                                        className="group cursor-pointer bg-[#111e48]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 hover:bg-[#111e48]/60 hover:border-[#f6423a] transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 hover:shadow-2xl hover:shadow-red-900/10"
                                    >
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#f6423a] transition-colors bg-[#0e1736] flex items-center justify-center">
                                                {member.user_data?.profile_picture || member.profile_picture ? (
                                                    <img
                                                        src={member.profile_picture || member.user_data?.profile_picture}
                                                        alt={getStaffName(member)}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-3xl font-black text-[#f6423a]">{getStaffName(member)[0]?.toUpperCase() || 'S'}</span>
                                                )}
                                            </div>
                                            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#111e48] ${member.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-white text-base group-hover:text-[#f6423a] transition-colors line-clamp-1">{getStaffName(member)}</h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{member.designation || 'Staff'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-[#111e48]/20 rounded-[3rem] border border-white/5 border-dashed">
                                <MdPersonSearch size={72} className="mx-auto text-gray-800 mb-8" />
                                <h3 className="text-2xl font-black text-white">No Personnel Matches</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mt-4 font-medium italic">"Every great project starts with the right team. Try clearing your filters or onboard new talent."</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredStaff.map((member) => (
                                <div
                                    key={member.id}
                                    onClick={() => router.push(`/dashboard/hr/${member.id}`)}
                                    className="group cursor-pointer bg-[#111e48]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 hover:bg-[#111e48]/60 hover:border-[#f6423a] transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 hover:shadow-2xl hover:shadow-red-900/10"
                                >
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#f6423a] transition-colors bg-[#0e1736] flex items-center justify-center">
                                            {member.user_data?.profile_picture || member.profile_picture ? (
                                                <img
                                                    src={member.profile_picture || member.user_data?.profile_picture}
                                                    alt={getStaffName(member)}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-3xl font-black text-[#f6423a]">{getStaffName(member)[0]?.toUpperCase() || 'S'}</span>
                                            )}
                                        </div>
                                        <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#111e48] ${member.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-white text-base group-hover:text-[#f6423a] transition-colors line-clamp-1">{getStaffName(member)}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{member.designation || 'Staff'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#071236] rounded-[2rem] border border-white/5 p-8 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f6423a]/10 rounded-full text-[#f6423a] text-xs font-black uppercase mb-4">
                                <span className="w-2 h-2 rounded-full bg-[#f6423a] animate-ping" />
                                Live Session
                            </div>
                            <h3 className="text-white font-black text-xl mb-2">Daily Summary</h3>
                            <p className="text-gray-500 text-sm font-medium italic">Shift started at 9:00 AM • Current presence: 0/{staff.length}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'payroll' && (
                    <div className="animate-fadeIn space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-[#111e48]/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2">Payout Engine</h2>
                                    <p className="text-gray-500 text-sm mb-10">Consolidated disbursements and financial settlements.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#050b2b] p-8 rounded-[2rem] border border-white/5">
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Projected Payout</p>
                                        <p className="text-3xl font-black text-white flex items-center gap-2">
                                            <span className="text-[#f6423a] text-lg mt-1 font-medium">रु</span> 0.00
                                        </p>
                                    </div>
                                    <div className="bg-[#050b2b] p-8 rounded-[2rem] border border-white/5">
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Pending Adjustments</p>
                                        <p className="text-3xl font-black text-blue-400">0</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#f6423a] rounded-[3rem] p-10 text-white shadow-2xl shadow-red-900/20 relative overflow-hidden group">
                                <MdWarning className="absolute -bottom-4 -right-4 text-white/5 size-40 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-black mb-6">Execution Required</h3>
                                <p className="text-white/80 text-sm leading-relaxed mb-10 relative z-10 font-medium">
                                    3 freelancers have completed their structural assignments. Verify performance ratings to unlock payment disbursements.
                                </p>
                                <button className="w-full bg-white text-[#f6423a] font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:shadow-xl transition-all relative z-10">
                                    Verify & Clear Dues
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
