'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchDashboardOverview } from '@/utils/lib/redux/features/management/managementSlice';
import StatCard from '@/components/dashboard/StatCard';
import SectionCard from '@/components/dashboard/SectionCard';
import {
    MdInventory,
    MdDescription,
    MdPeople,
    MdCheckCircle,
    MdWarning,
    MdArrowForward,
    MdEngineering,
    MdSearch,
    MdManageSearch,
    MdArrowOutward
} from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import { DashboardOverviewSkeleton } from '@/components/Skeletons';
import Link from 'next/link';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { overview, overviewLoading, error } = useSelector((s: RootState) => s.management);

    useEffect(() => {
        dispatch(fetchDashboardOverview() as any);
    }, [dispatch]);

    if (overviewLoading && !overview) {
        return <DashboardOverviewSkeleton />;
    }

    const stats = overview?.stats || {
        total_products: 0,
        total_services: 0,
        pending_quotations: 0,
        staff_count: 0
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">System Overview</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">
                        Real-time operational health and inquiry stream.
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20">System Online</span>
                </div>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Catalog"
                    value={stats.total_products}
                    icon={<MdInventory size={24} />}
                />
                <StatCard
                    title="Inquiry Queue"
                    value={stats.pending_quotations}
                    icon={<MdDescription size={24} />}
                    accent
                />
                <StatCard
                    title="Team Size"
                    value={stats.staff_count}
                    icon={<MdPeople size={24} />}
                />
                <StatCard
                    title="Live Services"
                    value={stats.total_services}
                    icon={<MdEngineering size={24} />}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* SEO Diagnostics - NEW SECTION */}
                <div className="xl:col-span-1 bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <MdManageSearch className="text-amber-400" size={24} />
                            <h2 className="text-lg font-black text-white uppercase tracking-tight">SEO Health</h2>
                        </div>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{overview?.seo_alerts.length || 0} Alerts</span>
                    </div>

                    <div className="space-y-4">
                        {overview?.seo_alerts && overview.seo_alerts.length > 0 ? (
                            overview.seo_alerts.map((alert, idx) => (
                                <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-sm font-bold text-white truncate pr-4">{alert.name}</h3>
                                        <Link href={`/dashboard/products/${alert.slug}`} className="text-amber-400 hover:scale-110 transition shrink-0">
                                            <MdArrowOutward size={18} />
                                        </Link>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {alert.missing.map((m, mIdx) => (
                                            <span key={mIdx} className="text-[8px] font-black uppercase bg-amber-400/10 text-amber-500 px-2 py-0.5 rounded">
                                                Missing {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-gray-500 italic text-sm">
                                <MdCheckCircle className="mx-auto mb-4 text-green-500 opacity-20" size={48} />
                                All products are fully optimized.
                            </div>
                        )}
                    </div>
                    {overview?.seo_alerts && overview.seo_alerts.length > 5 && (
                        <Link href="/dashboard/products" className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-white transition">
                            View All Products <MdArrowForward />
                        </Link>
                    )}
                </div>

                {/* Latest Quotations - NEW SECTION */}
                <div className="xl:col-span-2 bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <MdDescription className="text-blue-400" size={24} />
                            <h2 className="text-lg font-black text-white uppercase tracking-tight">Recent Inquiries</h2>
                        </div>
                        <Link href="/dashboard/quotations" className="text-xs font-black text-blue-400 hover:underline uppercase tracking-widest">
                            View Manager
                        </Link>
                    </div>

                    <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Interested In</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {overview?.recent_quotations && overview.recent_quotations.length > 0 ? (
                                    overview.recent_quotations.map((q, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{q.guest_name || q.user_name}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium">{q.guest_email || 'Verified User'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-medium text-gray-300">{q.product_name || 'General Inquiry'}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${q.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                    q.status === 'quoted' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-green-500/10 text-green-500'
                                                    }`}>
                                                    {q.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right font-medium text-xs text-gray-500 whitespace-nowrap">
                                                {new Date(q.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-gray-500 italic text-sm">
                                            No recent inquiries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
