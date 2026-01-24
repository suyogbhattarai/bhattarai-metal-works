'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchProducts, fetchQuotations, fetchBookings } from '@/utils/lib/redux/features/products/productSlice';
import StatCard from '@/components/dashboard/StatCard';
import SectionCard from '@/components/dashboard/SectionCard';
import React, { useEffect } from 'react';
import { MdInventory, MdDescription, MdCalendarToday, MdAttachMoney } from 'react-icons/md';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { products, quotations, bookings } = useSelector((s: RootState) => s.products);

    useEffect(() => {
        dispatch(fetchProducts({}) as any);
        dispatch(fetchQuotations() as any);
        dispatch(fetchBookings() as any);
    }, [dispatch]);

    return (
        <div className="space-y-6 ">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Analytics Overview</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Real-time operational insights
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Products" value={products?.length || 0} icon={<MdInventory />} />
                <StatCard title="Pending Quotations" value={quotations?.length || 0} icon={<MdDescription />} accent />
                <StatCard title="Bookings" value={bookings?.length || 0} icon={<MdCalendarToday />} />
                <StatCard title="Revenue" value="—" icon={<MdAttachMoney />} />
            </div>

            {/* Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <SectionCard title="Recent Quotations">
                    <p className="text-sm text-gray-400">Latest quotation activity will appear here.</p>
                </SectionCard>

                <SectionCard title="Recent Bookings">
                    <p className="text-sm text-gray-400">Latest booking activity will appear here.</p>
                </SectionCard>
            </div>
        </div>
    );
}
