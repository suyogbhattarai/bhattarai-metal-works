import React from 'react';
import { MdDelete, MdEdit, MdCategory } from 'react-icons/md';
import { getApiImageUrl } from '@/utils/imageUrl';
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
    category: any;
    onEdit: (category: any) => void;
    onDelete: (category: any) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/dashboard/categories/${category.id}`)}
            className="group relative bg-[#111e48] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 h-full flex flex-col cursor-pointer"
        >
            {/* Image Area */}
            <div className="aspect-video bg-[#0a1642] relative overflow-hidden">
                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-[-10px] group-hover:translate-y-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit(category);
                        }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-[#f6423a] text-white backdrop-blur-md transition border border-white/10 shadow-lg"
                        title="Edit"
                    >
                        <MdEdit size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(category);
                        }}
                        className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md transition border border-white/10 shadow-lg"
                        title="Delete"
                    >
                        <MdDelete size={16} />
                    </button>
                </div>

                {category.image ? (
                    <img
                        src={getApiImageUrl(category.image)}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <MdCategory size={48} className="mb-2 opacity-50" />
                        <span className="text-xs font-medium">No Image</span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                        {category.name}
                    </h3>
                    <span className="shrink-0 bg-[#f6423a]/10 text-[#f6423a] px-2.5 py-1 rounded-lg text-xs font-bold ring-1 ring-[#f6423a]/20">
                        {category.product_count || 0} Products
                    </span>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                    {category.description || 'Manage products in this category.'}
                </p>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    <span>Category ID: {category.id}</span>
                </div>
            </div>
        </div>
    );
}
