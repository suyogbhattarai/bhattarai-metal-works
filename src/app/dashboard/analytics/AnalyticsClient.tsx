'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchAnalytics } from '@/utils/lib/redux/features/management/managementSlice';
import {
    MdSearch,
    MdTrendingUp,
    MdGppMaybe,
    MdArrowForward,
    MdInventory2,
    MdEngineering,
    MdManageSearch,
    MdCheckCircle,
    MdArrowOutward
} from 'react-icons/md';
import { FiLoader, FiActivity } from 'react-icons/fi';

export default function AnalyticsClient() {
    const dispatch = useDispatch();
    const { analytics, analyticsLoading, error } = useSelector((state: RootState) => state.management);

    useEffect(() => {
        dispatch(fetchAnalytics() as any);
    }, [dispatch]);

    if (analyticsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FiLoader className="animate-spin text-[#f6423a] mb-4" size={48} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Intelligence...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 bg-red-950/20 border border-red-500/20 rounded-[2rem] text-red-500 text-center">
                <MdGppMaybe size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-bold uppercase tracking-tighter">Connection Interrupted</p>
                <p className="text-red-400/60 text-xs mt-1">{error}</p>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Simple Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-black text-white">Analytics</h1>
                    <p className="text-gray-500 text-sm font-medium">Real-time performance and SEO diagnostics.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-400/10 rounded-xl">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Products</p>
                        <p className="text-xl font-black text-white">{analytics.summary.total_products}</p>
                    </div>
                    <div className="px-4 py-2 bg-[#f6423a]/10 border border-[#f6423a]/10 rounded-xl">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total Inquiries</p>
                        <p className="text-xl font-black text-white">{analytics.summary.total_queries}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Search Vectors */}
                <div className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <MdTrendingUp className="text-[#f6423a]" size={24} />
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Top Searches</h2>
                    </div>
                    <div className="space-y-3">
                        {analytics.top_searches.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5">
                                <span className="font-bold text-gray-300 capitalize flex items-center gap-3">
                                    <MdSearch className="text-gray-600" />
                                    {item.query}
                                </span>
                                <span className="text-sm font-black text-white">{item.search_count} hits</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Engagement Heatmap */}
                <div className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <MdManageSearch className="text-blue-400" size={24} />
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Product Interest</h2>
                    </div>
                    <div className="space-y-6">
                        {analytics.top_views.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400 truncate pr-4">{item.product__name}</span>
                                    <span className="text-white">{item.view_count} views</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(item.view_count / (analytics.top_views[0]?.view_count || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEO Scorecard - Simplified */}
            <div className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-10">
                <div className="flex items-center gap-4 mb-10">
                    <MdGppMaybe className="text-amber-400" size={24} />
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">SEO Scorecard</h2>
                </div>

                {analytics.seo_suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analytics.seo_suggestions.map((item, idx) => (
                            <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white text-sm line-clamp-1">{item.name}</h3>
                                    <a href={`/dashboard/products/${item.slug}`} className="text-amber-400">
                                        <MdArrowOutward size={18} />
                                    </a>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {item.missing.map((m, mIdx) => (
                                        <span key={mIdx} className="bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                                    "{item.suggestion}"
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-green-500/5 border border-green-500/10 rounded-3xl">
                        <MdCheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                        <p className="text-white font-black uppercase text-xs">All products are optimized</p>
                    </div>
                )}
            </div>

            {/* Simplified Strategy Alert */}
            <div className="bg-[#071236] border border-[#f6423a]/20 p-8 rounded-[2rem] flex items-center gap-6">
                <div className="hidden md:flex w-16 h-16 bg-[#f6423a]/10 text-[#f6423a] rounded-2xl items-center justify-center shrink-0">
                    <MdInsights size={32} />
                </div>
                <div>
                    <h3 className="text-white font-black uppercase tracking-tight mb-1">Growth Insight</h3>
                    <p className="text-gray-400 text-sm font-medium">
                        Interest in <span className="text-[#f6423a] font-bold italic">"{analytics.top_searches[0]?.query || 'Structural Solutions'}"</span> is peaking.
                        Optimize your top products with deeper descriptions to increase organic leads.
                    </p>
                </div>
            </div>
        </div>
    );
}
