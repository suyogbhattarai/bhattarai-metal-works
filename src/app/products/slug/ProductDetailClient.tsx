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
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
                );

                setIsGsapReady(true);
            };
            setTimeout(initGsap, 300);
        }
    }, [currentProductLoading, currentProduct]);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<MdOutlineStar key={i} className="text-amber-400" size={18} />);
            } else if (i - 0.5 <= rating) {
                stars.push(<MdOutlineStarHalf key={i} className="text-amber-400" size={18} />);
            } else {
                stars.push(<MdOutlineStar key={i} className="text-slate-200" size={18} />);
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
                <h1 className="text-4xl font-black mb-4">Masterpiece Not Found</h1>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">The artifact you are looking for may have been archived or moved to a specialized category.</p>
                <Link href="/products" className="bg-[#f6423a] px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl">Return to Catalog</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen relative selection:bg-[#f6423a] selection:text-white" ref={containerRef}>
            <Navbar />

            {/* Premium Header / Breadcrumbs */}
            <div className={`pt-32 md:pt-40 lg:pt-48 pb-10 bg-white border-b border-slate-100 ${currentProductLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}`}>
                <div className="w-full max-w-[1920px] mx-auto lg:px-15 md:px-10 px-5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="animate-detail">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 group">
                                <Link href="/" className="hover:text-[#f6423a] transition-colors">Engineering</Link>
                                <MdChevronRight className="text-slate-200" size={14} />
                                <Link href="/products" className="hover:text-[#f6423a] transition-colors">Catalog</Link>
                                {currentProduct && (
                                    <>
                                        <MdChevronRight className="text-slate-200" size={14} />
                                        <span className="text-[#f6423a] font-bold">{currentProduct.name}</span>
                                    </>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-[#071236] leading-none tracking-tight">
                                {currentProduct?.name}
                            </h1>
                        </div>

                        <div className="animate-detail hidden md:flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticity</p>
                                <div className="flex items-center gap-2 text-[#071236] font-black text-xs uppercase">
                                    <MdVerified className="text-[#f6423a]" size={16} />
                                    Original Spec
                                </div>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-100" />
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Level</p>
                                <div className="flex items-center gap-2 text-[#071236] font-black text-xs uppercase">
                                    <MdArchitecture className="text-[#f6423a]" size={16} />
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
                <main className={`w-full max-w-[1920px] mx-auto lg:px-15 md:px-10 px-5 py-12 md:py-16 ${isGsapReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Left Column: Cinematic Gallery */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="animate-detail relative aspect-[16/10] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200/50 group">
                                {activeImage ? (
                                    <img
                                        src={getApiImageUrl(activeImage) || undefined}
                                        alt={currentProduct.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-slate-300 flex flex-col items-center justify-center h-full gap-4">
                                        <MdOutlineDescription size={64} className="opacity-20" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Image Vault Offline</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-[#071236]/30 to-transparent pointer-events-none" />

                                {currentProduct.is_featured && (
                                    <div className="absolute top-10 left-10 flex items-center gap-2 bg-[#f6423a] text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-2xl shadow-red-900/40">
                                        <MdAutoAwesome className="animate-pulse" />
                                        Signature Production
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strips */}
                            <div className="animate-detail flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {(currentProduct.primary_image || (currentProduct.images && currentProduct.images.length > 0)) && (
                                    <button
                                        onClick={() => {
                                            const mainImg = typeof currentProduct.primary_image === 'string'
                                                ? currentProduct.primary_image
                                                : (currentProduct as any)?.primary_image?.image;
                                            setActiveImage(mainImg || (currentProduct.images ? currentProduct.images[0].image : null));
                                        }}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 shadow-sm
                                            ${activeImage === (typeof currentProduct.primary_image === 'string' ? currentProduct.primary_image : (currentProduct as any)?.primary_image?.image)
                                                ? 'border-[#f6423a] scale-90 translate-y-1' : 'border-transparent opacity-60 hover:opacity-100 bg-white'}`}
                                    >
                                        <img
                                            src={getApiImageUrl(typeof currentProduct.primary_image === 'string' ? currentProduct.primary_image : (currentProduct as any)?.primary_image?.image) || (currentProduct.images ? getApiImageUrl(currentProduct.images[0].image) : '') || ''}
                                            alt="Main Master"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                )}
                                {currentProduct.images?.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(img.image)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 shadow-sm
                                            ${activeImage === img.image ? 'border-[#f6423a] scale-90 translate-y-1' : 'border-transparent opacity-60 hover:opacity-100 bg-white'}`}
                                    >
                                        <img src={getApiImageUrl(img.image) || ''} alt={img.alt_text} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Specification & Action */}
                        <div className="lg:col-span-5 flex flex-col gap-10">
                            <div className="animate-detail">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex">
                                        {renderStars(currentProduct.average_rating || 0)}
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Verified Experience ({currentProduct.review_count || 0})</span>
                                </div>

                                <p className="text-[#f6423a] font-black text-[11px] uppercase tracking-[0.3em] mb-4">Pricing Tier</p>
                                <div className="flex items-baseline gap-3 mb-8">
                                    <span className="text-4xl font-black text-[#071236]">
                                        {currentProduct.is_price_visible ? (
                                            <><span className="text-[#f6423a] text-xl mr-1">Rs.</span>{parseFloat(currentProduct.base_price).toLocaleString()}</>
                                        ) : (
                                            'Custom Quote'
                                        )}
                                    </span>
                                    {currentProduct.is_price_visible && <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">+ Tax / Delv.</span>}
                                </div>

                                <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-relaxed mb-10">
                                    <p>{currentProduct.description || 'Precision-crafted metal solution engineered for longevity and architectural beauty. This artifact represents our commitment to durability and aesthetic excellence.'}</p>
                                </div>
                            </div>

                            <div className="animate-detail bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                        <MdBuild className="text-[#f6423a]" />
                                        Component Specs
                                    </h3>
                                    <ul className="space-y-6">
                                        {currentProduct.materials?.map((mat) => (
                                            <li key={mat.id} className="flex items-start gap-4 group">
                                                <div className="mt-1 flex-shrink-0 text-[#f6423a]">
                                                    <MdCheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-1 pb-4 border-b border-slate-50">
                                                    <p className="font-black text-[#071236] text-[13px] uppercase tracking-tight">{mat.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-1">{mat.description || 'Premium grade construction material.'}</p>
                                                </div>
                                            </li>
                                        ))}
                                        {currentProduct.is_customizable && (
                                            <li className="flex items-start gap-4">
                                                <div className="mt-0.5 flex-shrink-0 text-[#f6423a]">
                                                    <MdCheckCircle size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-black text-[#071236] text-[13px] uppercase tracking-tight">Adaptive Design</p>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-1">{currentProduct.customization_note || 'Tailored to your specific architectural requirements.'}</p>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        href={isAuthenticated ? `/products/${currentProduct.slug}/quote` : `/login?redirect=/products/${currentProduct.slug}`}
                                        className="flex items-center justify-center gap-4 w-full bg-[#071236] hover:bg-[#f6423a] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-300 hover:-translate-y-1"
                                    >
                                        Inquire Spec <MdArrowForward size={18} />
                                    </Link>
                                    <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">Typical Lead Time: 7-14 Business Days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Tabs */}
                    <div className="mt-24 md:mt-32">
                        <div className="flex items-center gap-12 border-b border-slate-100 mb-12">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'details' ? 'text-[#f6423a]' : 'text-slate-300 hover:text-slate-500'}`}
                            >
                                Detailed Spec
                                {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f6423a] rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'reviews' ? 'text-[#f6423a]' : 'text-slate-300 hover:text-slate-500'}`}
                            >
                                Client Reviews ({currentProduct.review_count || 0})
                                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f6423a] rounded-t-full" />}
                            </button>
                        </div>

                        <div className="animate-detail min-h-[400px]">
                            {activeTab === 'details' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                                    <div className="lg:col-span-8">
                                        <h4 className="text-2xl font-black text-[#071236] mb-8 uppercase tracking-tighter">Manufacturing Context</h4>
                                        <div className="prose prose-lg max-w-none text-slate-500 font-medium leading-[1.8] space-y-6">
                                            <p>{currentProduct.description}</p>
                                            <p>Our production workflow ensures that every weld and finish meets our internal ISO-aligned standards. For large scale architectural projects, we provide full CAD verification before production begins.</p>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 h-fit">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center bg-slate-50 py-2 rounded-full">Engineering Dimensions</p>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Vertical / Height', val: currentProduct.height ? `${currentProduct.height} cm` : 'Adaptive' },
                                                { label: 'Span / Width', val: currentProduct.width ? `${currentProduct.width} cm` : 'Adaptive' },
                                                { label: 'Depth / Long.', val: currentProduct.length ? `${currentProduct.length} cm` : 'Adaptive' },
                                                { label: 'Mass / Weight', val: currentProduct.weight ? `${currentProduct.weight} kg (Appx.)` : 'Variable' }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center group">
                                                    <span className="text-slate-400 font-black uppercase tracking-tighter text-[11px] group-hover:text-[#f6423a] transition-colors">{item.label}</span>
                                                    <span className="text-[#071236] font-black text-sm">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-12 max-w-4xl">
                                    {isAuthenticated ? (
                                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                                            <h4 className="text-sm font-black text-[#071236] uppercase tracking-[0.2em] mb-8">Share Your Project Experience</h4>
                                            <form onSubmit={handleReviewSubmit} className="space-y-8">
                                                <div className="flex items-center gap-6">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate Production:</span>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setRating(s)}
                                                                className="transition-transform active:scale-75"
                                                            >
                                                                <MdOutlineStar
                                                                    size={32}
                                                                    className={s <= rating ? 'text-amber-400' : 'text-slate-100'}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Describe the build quality and service experience..."
                                                    required
                                                    rows={4}
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-[#f6423a]/20 outline-none transition-all placeholder:text-slate-400"
                                                />
                                                {reviewError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{reviewError}</p>}
                                                {reviewSuccess && <p className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><MdCheckCircle /> Feedback Published</p>}
                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingReview}
                                                    className="bg-[#071236] hover:bg-[#f6423a] text-white px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50 transition-all flex items-center gap-3"
                                                >
                                                    {isSubmittingReview ? <FiLoader className="animate-spin text-lg" /> : 'Publish Review'}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 p-12 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                                            <p className="text-slate-400 font-bold text-sm tracking-tight uppercase">Authentication required to share feedback.</p>
                                            <Link href="/login" className="mt-4 inline-block text-[#f6423a] font-black text-sm hover:underline tracking-tight">Login to Your Account</Link>
                                        </div>
                                    )}

                                    <div className="space-y-8">
                                        {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
                                            currentProduct.reviews.map((review: any) => (
                                                <div key={review.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row gap-8 items-start hover:border-[#f6423a]/10 transition-all group">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 flex items-center justify-center font-black text-[#071236] text-xl">
                                                        {review.user_avatar ? (
                                                            <img src={review.user_avatar} alt={review.user_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            review.user_name?.charAt(0) || '?'
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                            <div>
                                                                <h5 className="font-black text-[#071236] text-lg leading-none mb-1">{review.user_name}</h5>
                                                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                            </div>
                                                            <div className="flex">{renderStars(review.rating)}</div>
                                                        </div>
                                                        <p className="text-slate-500 text-base leading-relaxed font-medium italic group-hover:text-slate-700 transition-colors">"{review.comment}"</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 italic font-medium text-slate-400">
                                                No reviews have been authenticated for this spec yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Artifacts Grid */}
                    <div className="mt-28 md:mt-40">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="text-[#f6423a] font-black text-[10px] uppercase tracking-[0.3em] mb-4">You May Consult</p>
                                <h3 className="text-3xl md:text-5xl font-black text-[#071236] tracking-tighter uppercase leading-none">Related Collections</h3>
                            </div>
                            <div className="hidden md:flex gap-3">
                                <button className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#f6423a] hover:border-[#f6423a] transition-all">
                                    <MdNavigateBefore size={28} />
                                </button>
                                <button className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#f6423a] hover:border-[#f6423a] transition-all">
                                    <MdNavigateNext size={28} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {relatedProducts.filter(p => p.slug !== slug).map((product) => (
                                <Link
                                    href={`/products/${product.slug}`}
                                    key={product.id}
                                    className="group flex flex-col"
                                >
                                    <div className="aspect-square overflow-hidden rounded-[2.5rem] bg-slate-100 relative shadow-xl shadow-slate-200/50 mb-6">
                                        <img
                                            src={getApiImageUrl(product.primary_image) || ''}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#071236]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="px-2">
                                        <h4 className="font-black text-[#071236] text-[15px] group-hover:text-[#f6423a] transition-colors line-clamp-1 uppercase tracking-tight mb-2">{product.name}</h4>
                                        <p className="font-black text-[#f6423a] text-xs">
                                            {product.is_price_visible ? (
                                                <><span className="text-[9px] mr-1">Rs.</span>{parseFloat(product.base_price).toLocaleString()}</>
                                            ) : 'Consulting Required'}
                                        </p>
                                    </div>
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
