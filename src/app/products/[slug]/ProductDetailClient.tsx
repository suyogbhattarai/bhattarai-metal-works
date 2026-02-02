'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchProductDetail, fetchProducts, clearCurrentProduct, createReview } from '@/utils/lib/redux/features/products/productSlice';
import { addRecentlyViewed } from '@/utils/lib/redux/features/auth/authSlice';
import { getApiImageUrl } from '@/utils/imageUrl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    MdOutlineStar,
    MdOutlineStarHalf,
    MdCheckCircle,
    MdNavigateNext,
    MdNavigateBefore,
    MdEmail,
    MdPhone,
    MdOutlineDescription,
    MdArrowForward,
    MdChevronRight,
    MdAutoAwesome,
    MdVerified,
    MdBuild,
    MdArchitecture
} from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import gsap from 'gsap';
import Link from 'next/link';
import { ProductDetailSkeleton } from '@/components/Skeletons';

export default function ProductDetailClient() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentProduct, currentProductLoading, products: relatedProducts } = useSelector((state: RootState) => state.products);
    const { isAuthenticated, user: authUser } = useSelector((state: RootState) => state.auth);

    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
    const [isGsapReady, setIsGsapReady] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        if (slug) {
            dispatch(fetchProductDetail(slug as string) as any);
        }
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, slug]);

    useEffect(() => {
        if (currentProduct) {
            dispatch(addRecentlyViewed({
                id: currentProduct.id,
                name: currentProduct.name,
                slug: currentProduct.slug,
                primary_image: currentProduct.primary_image,
                base_price: currentProduct.base_price,
                is_price_visible: currentProduct.is_price_visible
            }));

            let mainImg = null;
            if (currentProduct.primary_image) {
                mainImg = typeof currentProduct.primary_image === 'string'
                    ? currentProduct.primary_image
                    : (currentProduct as any).primary_image?.image;
            } else if (currentProduct.images && currentProduct.images.length > 0) {
                mainImg = currentProduct.images[0].image;
            }
            setActiveImage(mainImg);

            const categorySlug = typeof currentProduct.category === 'string'
                ? currentProduct.category
                : currentProduct.category?.slug;

            if (categorySlug) {
                dispatch(fetchProducts({ category: categorySlug, page_size: 5 }) as any);
            }
        }
    }, [currentProduct, dispatch]);

    useEffect(() => {
        if (!currentProductLoading && currentProduct) {
            const initGsap = () => {
                const tl = gsap.timeline();
                tl.fromTo('.animate-detail',
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
                );

                setIsGsapReady(true);
            };
            setTimeout(initGsap, 200);
        }
    }, [currentProductLoading, currentProduct]);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<MdOutlineStar key={i} className="text-amber-400" size={14} />);
            } else if (i - 0.5 <= rating) {
                stars.push(<MdOutlineStarHalf key={i} className="text-amber-400" size={14} />);
            } else {
                stars.push(<MdOutlineStar key={i} className="text-slate-200" size={14} />);
            }
        }
        return stars;
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug) return;

        setIsSubmittingReview(true);
        setReviewError(null);

        try {
            const resultAction = await dispatch(createReview({
                slug: slug as string,
                data: { rating, comment }
            }) as any);

            if (createReview.fulfilled.match(resultAction)) {
                setReviewSuccess(true);
                setComment('');
                setRating(5);
                dispatch(fetchProductDetail(slug as string) as any);
                setTimeout(() => setReviewSuccess(false), 5000);
            } else {
                setReviewError(resultAction.payload || 'Failed to submit review.');
            }
        } catch (err) {
            setReviewError('An unexpected error occurred.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (!currentProduct && !currentProductLoading) {
        return (
            <div className="min-h-screen bg-[#071236] pt-40 px-6 text-center text-white">
                <h1 className="text-2xl font-black mb-4">Product Not Found</h1>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">The item you are looking for may have been moved or removed.</p>
                <Link href="/products" className="bg-[#f6423a] px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Return to Catalog</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen relative selection:bg-[#f6423a] selection:text-white" ref={containerRef}>
            <Navbar />

            {/* Compact Header / Breadcrumbs */}
            <div className={`pt-24 md:pt-32 lg:pt-36 pb-6 bg-white border-b border-slate-100 ${currentProductLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
                <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="animate-detail">
                            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 group">
                                <Link href="/" className="hover:text-[#f6423a] transition-colors">Home</Link>
                                <MdChevronRight className="text-slate-200" size={12} />
                                <Link href="/products" className="hover:text-[#f6423a] transition-colors">Catalog</Link>
                                {currentProduct && (
                                    <>
                                        <MdChevronRight className="text-slate-200" size={12} />
                                        <span className="text-[#f6423a] font-bold">{currentProduct.name}</span>
                                    </>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-[#071236] leading-tight tracking-tight">
                                {currentProduct?.name}
                            </h1>
                        </div>

                        <div className="animate-detail hidden md:flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Authenticity</p>
                                <div className="flex items-center gap-1.5 text-[#071236] font-bold text-[10px] uppercase">
                                    <MdVerified className="text-[#f6423a]" size={14} />
                                    Original Spec
                                </div>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-100" />
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Project Level</p>
                                <div className="flex items-center gap-1.5 text-[#071236] font-bold text-[10px] uppercase">
                                    <MdArchitecture className="text-[#f6423a]" size={14} />
                                    {currentProduct?.is_featured ? 'Tier 1 / Sign.' : 'Standard'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {currentProductLoading ? (
                <div className="bg-[#f8fafc]">
                    <ProductDetailSkeleton />
                </div>
            ) : currentProduct ? (
                <main className={`w-full max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10 ${isGsapReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                    <div className="grid grid-cols-1 lg:grid-cols-11 gap-10">

                        {/* Left Column: Gallery */}
                        <div className="lg:col-span-6 space-y-4">
                            <div className="animate-detail relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm group">
                                {activeImage ? (
                                    <img
                                        src={getApiImageUrl(activeImage) || undefined}
                                        alt={currentProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-slate-300 flex flex-col items-center justify-center h-full gap-2">
                                        <MdOutlineDescription size={48} className="opacity-20" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">No Image Available</span>
                                    </div>
                                )}

                                {currentProduct.is_featured && (
                                    <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-[#f6423a] text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                        <MdAutoAwesome size={12} />
                                        Signature Production
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="animate-detail flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {(currentProduct.primary_image || (currentProduct.images && currentProduct.images.length > 0)) && (
                                    <button
                                        onClick={() => {
                                            const mainImg = typeof currentProduct.primary_image === 'string'
                                                ? currentProduct.primary_image
                                                : (currentProduct as any)?.primary_image?.image;
                                            setActiveImage(mainImg || (currentProduct.images ? currentProduct.images[0].image : null));
                                        }}
                                        className={`relative w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200
                                            ${activeImage === (typeof currentProduct.primary_image === 'string' ? currentProduct.primary_image : (currentProduct as any)?.primary_image?.image)
                                                ? 'border-[#f6423a] scale-95' : 'border-transparent opacity-60 hover:opacity-100 bg-white'}`}
                                    >
                                        <img
                                            src={getApiImageUrl(typeof currentProduct.primary_image === 'string' ? currentProduct.primary_image : (currentProduct as any)?.primary_image?.image) || (currentProduct.images ? getApiImageUrl(currentProduct.images[0].image) : '') || ''}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                )}
                                {currentProduct.images?.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(img.image)}
                                        className={`relative w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200
                                            ${activeImage === img.image ? 'border-[#f6423a] scale-95' : 'border-transparent opacity-60 hover:opacity-100 bg-white'}`}
                                    >
                                        <img src={getApiImageUrl(img.image) || ''} alt={img.alt_text} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <div className="animate-detail">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex">
                                        {renderStars(currentProduct.average_rating || 0)}
                                    </div>
                                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Verified Experience ({currentProduct.review_count || 0})</span>
                                </div>

                                <p className="text-[#f6423a] font-black text-[9px] uppercase tracking-[0.2em] mb-2">Pricing Tier</p>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-3xl font-black text-[#071236]">
                                        {currentProduct.is_price_visible ? (
                                            <><span className="text-[#f6423a] text-lg mr-0.5">Rs.</span>{parseFloat(currentProduct.base_price).toLocaleString()}</>
                                        ) : (
                                            'Custom Quote'
                                        )}
                                    </span>
                                    {currentProduct.is_price_visible && <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">+ Tax / Delv.</span>}
                                </div>

                                <div className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                    <p>{currentProduct.description || 'Precision-crafted metal solution engineered for longevity and architectural beauty.'}</p>
                                </div>
                            </div>

                            <div className="animate-detail bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                                <div>
                                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <MdBuild className="text-[#f6423a]" />
                                        Component Specs
                                    </h3>
                                    <ul className="space-y-3">
                                        {currentProduct.materials?.map((mat) => (
                                            <li key={mat.id} className="flex items-start gap-3">
                                                <div className="mt-0.5 flex-shrink-0 text-[#f6423a]">
                                                    <MdCheckCircle size={14} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-[#071236] text-[11px] uppercase tracking-tight">{mat.name}</p>
                                                </div>
                                            </li>
                                        ))}
                                        {currentProduct.is_customizable && (
                                            <li className="flex items-start gap-3">
                                                <div className="mt-0.5 flex-shrink-0 text-[#f6423a]">
                                                    <MdCheckCircle size={14} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-[#071236] text-[11px] uppercase tracking-tight">Adaptive Design Available</p>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href={isAuthenticated ? `/products/${currentProduct.slug}/quote` : `/login?redirect=/products/${currentProduct.slug}`}
                                        className="flex items-center justify-center gap-2 w-full bg-[#071236] hover:bg-[#f6423a] text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all"
                                    >
                                        Inquire Specification <MdArrowForward size={14} />
                                    </Link>
                                    <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest">Lead Time: 7-14 Business Days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Info Tabs */}
                    <div className="mt-12 md:mt-16">
                        <div className="flex items-center gap-8 border-b border-slate-100 mb-8">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`pb-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === 'details' ? 'text-[#f6423a]' : 'text-slate-300'}`}
                            >
                                Details
                                {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f6423a] rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === 'reviews' ? 'text-[#f6423a]' : 'text-slate-300'}`}
                            >
                                Reviews ({currentProduct.review_count || 0})
                                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f6423a] rounded-t-full" />}
                            </button>
                        </div>

                        <div className="animate-detail">
                            {activeTab === 'details' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    <div className="lg:col-span-8">
                                        <h4 className="text-lg font-black text-[#071236] mb-4 uppercase tracking-tight">Manufacturing Context</h4>
                                        <div className="text-slate-500 text-sm font-medium leading-relaxed space-y-4">
                                            <p>{currentProduct.description}</p>
                                            <p>Our production workflow ensures that every weld and finish meets our internal quality standards. For large scale architectural projects, we provide full CAD verification before production begins.</p>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm h-fit">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Dimensions</p>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Height', val: currentProduct.height ? `${currentProduct.height} cm` : 'Adaptive' },
                                                { label: 'Width', val: currentProduct.width ? `${currentProduct.width} cm` : 'Adaptive' },
                                                { label: 'Length', val: currentProduct.length ? `${currentProduct.length} cm` : 'Adaptive' },
                                                { label: 'Weight', val: currentProduct.weight ? `${currentProduct.weight} kg` : 'Variable' }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center">
                                                    <span className="text-slate-400 font-bold uppercase text-[9px]">{item.label}</span>
                                                    <span className="text-[#071236] font-black text-[11px]">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 max-w-3xl">
                                    {isAuthenticated ? (
                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                            <h4 className="text-[10px] font-black text-[#071236] uppercase tracking-[0.15em] mb-6">Write a Review</h4>
                                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating:</span>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <button key={s} type="button" onClick={() => setRating(s)} className="transition-transform active:scale-90">
                                                                <MdOutlineStar size={20} className={s <= rating ? 'text-amber-400' : 'text-slate-100'} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Share your experience..."
                                                    required
                                                    rows={3}
                                                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-[13px] font-medium outline-none"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingReview}
                                                    className="bg-[#071236] text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] disabled:opacity-50"
                                                >
                                                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 font-bold text-xs uppercase tracking-tight">Login to write a review.</div>
                                    )}

                                    <div className="space-y-4">
                                        {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
                                            currentProduct.reviews.map((review: any) => (
                                                <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-4 items-start">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 shrink-0 border border-slate-100 flex items-center justify-center font-black text-[#071236] text-xs">
                                                        {review.user_name?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between gap-4 mb-2">
                                                            <h5 className="font-black text-[#071236] text-sm uppercase tracking-tight">{review.user_name}</h5>
                                                            <div className="flex">{renderStars(review.rating)}</div>
                                                        </div>
                                                        <p className="text-slate-500 text-[13px] leading-relaxed font-medium italic">"{review.comment}"</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-slate-400 text-xs italic">No reviews yet.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-16 md:mt-20">
                        <h3 className="text-xl font-black text-[#071236] tracking-tight uppercase mb-8">Related Products</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {relatedProducts.filter(p => p.slug !== slug).slice(0, 5).map((product) => (
                                <Link href={`/products/${product.slug}`} key={product.id} className="group">
                                    <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 mb-3 border border-slate-50">
                                        <img src={getApiImageUrl(product.primary_image) || ''} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    </div>
                                    <h4 className="font-black text-[#071236] text-[11px] group-hover:text-[#f6423a] transition-colors line-clamp-1 uppercase tracking-tight mb-1">{product.name}</h4>
                                    <p className="font-black text-[#f6423a] text-[11px]">
                                        {product.is_price_visible ? `Rs. ${parseFloat(product.base_price).toLocaleString()}` : 'Price on Quote'}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>
            ) : null}

            <Footer />
        </div>
    );
}
