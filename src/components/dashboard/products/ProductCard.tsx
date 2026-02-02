import React from 'react';
import { MdDelete, MdInventory, MdStar } from 'react-icons/md';
import { getApiImageUrl } from '@/utils/imageUrl';
import Link from 'next/link';

interface ProductCardProps {
    product: any;
    onEdit?: (product: any) => void;
    onDelete: (product: any) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
    const primaryImage = product.primary_image || (product.images && product.images.find((img: any) => img.is_primary)?.image);

    return (
        <Link href={`/dashboard/products/${product.slug}`} className="block h-full">
            <div className="group relative bg-[#111e48] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 h-full flex flex-col">
                {/* Image Area */}
                <div className="aspect-[4/3] bg-[#0a1642] relative overflow-hidden">
                    {product.is_featured && (
                        <div className="absolute top-3 left-3 z-10 bg-yellow-500/20 text-yellow-400 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-yellow-500/20">
                            <MdStar /> Featured
                        </div>
                    )}

                    {!product.is_active && (
                        <div className="absolute top-12 left-3 z-10 bg-red-500/20 text-red-400 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1 border border-red-500/20">
                            Inactive
                        </div>
                    )}

                    {/* Action Buttons Overlay - Only Delete now for quick action */}
                    <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-[-10px] group-hover:translate-y-0">
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigation
                                e.stopPropagation();
                                onDelete(product);
                            }}
                            className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md transition border border-white/10 shadow-lg"
                            title="Delete"
                        >
                            <MdDelete size={16} />
                        </button>
                    </div>

                    {primaryImage ? (
                        <img
                            src={getApiImageUrl(primaryImage) || undefined}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <MdInventory size={48} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">No Image</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute bottom-0 inset-x-0 h-1 ${product.is_in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        {/* Category Label Removed to prevent overflow */}
                        <span className="text-lg font-bold text-white">
                            ${parseFloat(product.base_price).toLocaleString('en-US')}
                        </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                        {product.description || 'No description available.'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5 mt-auto">
                        <span className={product.is_in_stock ? 'text-green-400' : 'text-red-400'}>
                            {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span>
                            {new Date(product.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </Link >
    );
}
