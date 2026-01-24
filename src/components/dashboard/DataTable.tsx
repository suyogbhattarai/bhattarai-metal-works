'use client';

import React, { useMemo } from 'react';
import { Skeleton } from '@/components/Loading';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data?: any[] | null;
    loading?: boolean;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onView?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data = [],
    loading = false,
    onEdit,
    onDelete,
    onView
}) => {
    // Ensure data is always an array
    const safeData = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            return [];
        }
        return data;
    }, [data]);

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={`skeleton-${i}`} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    if (safeData.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400 text-lg">No data available</p>
            </div>
        );
    }

    const hasActions = Boolean(onEdit || onDelete || onView);

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        {columns.map(col => (
                            <th
                                key={`header-${col.key}`}
                                className="text-left px-4 py-3 text-gray-400 font-medium text-sm"
                            >
                                {col.label}
                            </th>
                        ))}
                        {hasActions && (
                            <th className="text-right px-4 py-3 text-gray-400 font-medium text-sm">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {safeData.map((row, idx) => (
                        <tr
                            key={`row-${row.id || idx}`}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                        >
                            {columns.map(col => (
                                <td
                                    key={`cell-${row.id || idx}-${col.key}`}
                                    className="px-4 py-4 text-gray-300"
                                >
                                    {col.render
                                        ? col.render(row[col.key], row)
                                        : (row[col.key] ?? '-')}
                                </td>
                            ))}
                            {hasActions && (
                                <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {onView && (
                                            <button
                                                onClick={() => onView(row)}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                                                title="View"
                                                aria-label="View"
                                            >
                                                👁️
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition"
                                                title="Edit"
                                                aria-label="Edit"
                                            >
                                                ✏️
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                title="Delete"
                                                aria-label="Delete"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;