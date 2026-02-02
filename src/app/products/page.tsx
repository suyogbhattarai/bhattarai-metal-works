'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/utils/lib/redux/Store'
import { fetchCategories, fetchProducts } from '@/utils/lib/redux/features/products/productSlice'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getApiImageUrl } from '@/utils/imageUrl'
import {
  MdSearch,
  MdFilterList,
  MdClose,
  MdStar,
  MdTrendingUp,
  MdLocalOffer,
  MdAddShoppingCart,
  MdChevronLeft,
  MdChevronRight,
  MdAutoAwesome,
  MdArrowForward,
  MdLaunch,
  MdKeyboardArrowDown,
  MdEngineering
} from 'react-icons/md'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger);

const SEARCH_PLACEHOLDERS = [
  "Search for Stainless Steel Gates...",
  "Search for Metal Furniture...",
  "Search for Industrial Rollers...",
  "Search for Aluminum Windows...",
  "Search for Steel Structures..."
];

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { categories, products, productsLoading } = useSelector((state: RootState) => state.products)

  // Filters State
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest')
  const [initialFetchDone, setInitialFetchDone] = useState(false)

  // Typewriter State
  const [placeholder, setPlaceholder] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories() as any)
  }, [dispatch])

  useEffect(() => {
    const filter: any = {}
    if (activeFilter !== 'All') filter.category = activeFilter
    if (searchQuery) filter.search = searchQuery

    dispatch(fetchProducts(filter) as any).then(() => {
      setInitialFetchDone(true)
    })
  }, [dispatch, activeFilter, searchQuery])

  // Typewriter Effect
  useEffect(() => {
    const currentText = SEARCH_PLACEHOLDERS[placeholderIdx % SEARCH_PLACEHOLDERS.length];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholder(currentText.substring(0, placeholder.length + 1));
        if (placeholder.length === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setPlaceholder(currentText.substring(0, placeholder.length - 1));
        if (placeholder.length === 0) {
          setIsDeleting(false);
          setPlaceholderIdx(prev => prev + 1);
        }
      }
    }, isDeleting ? 30 : 70);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, placeholderIdx]);

  // Products Data for sections
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 5);
  const allFilteredProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.base_price) - parseFloat(b.base_price);
    if (sortBy === 'price-high') return parseFloat(b.base_price) - parseFloat(a.base_price);
    if (sortBy === 'popular') return (b.review_count || 0) - (a.review_count || 0);
    return b.id - a.id;
  });

  useEffect(() => {
    // Hero Animations - Refined
    const heroTl = gsap.timeline();
    heroTl.fromTo('.hero-text-animate',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power4.out', delay: 0.5 }
    );

    if (!productsLoading && initialFetchDone) {
      gsap.fromTo('.product-card-minimal',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.catalog-grid',
            start: 'top 85%',
          }
        }
      );
    }
  }, [productsLoading, initialFetchDone, activeFilter]);

  return (
    <div className="bg-white min-h-screen relative selection:bg-[#f6423a] selection:text-white overflow-x-hidden">
      <Navbar />

      <style jsx global>{`
                .hero-pattern {
                    background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
                    background-size: 32px 32px;
                }
            `}</style>

      {/* 1. Immersive Banner Section - Restored and Balanced Style */}
      <section className="relative w-full h-[550px] md:h-[700px] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true, bulletActiveClass: 'bg-white opacity-100 !w-6 transition-all' }}
          loop
          className="h-full w-full"
        >
          <SwiperSlide>
            <div className="relative h-full w-full bg-[#f6423a]">
              <div className="absolute inset-0 hero-pattern opacity-40" />
              <img src="https://images.unsplash.com/photo-1517420784564-98c86cc1c1ed?w=1920" className="absolute inset-0 w-full h-full object-cover opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div className="max-w-4xl mt-24">
                  <div className="hero-text-animate inline-flex items-center gap-2 px-4 py-1 border border-white/30 text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">
                    <MdEngineering size={14} /> Industrial Collection 2024
                  </div>
                  <h2 className="hero-text-animate text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-[1.1]">Legacy In <br /> Every Weld.</h2>
                  <p className="hero-text-animate text-white/90 text-sm md:text-lg mb-8 max-w-2xl mx-auto font-medium">Explore premium structural architectural components designed for high-end modern projects in Nepal.</p>
                  <div className="hero-text-animate">
                    <button className="bg-white text-[#f6423a] px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#071236] hover:text-white transition-all shadow-xl">Explore Catalogue</button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative h-full w-full bg-[#0d2360]">
              <div className="absolute inset-0 hero-pattern opacity-20" />
              <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920" className="absolute inset-0 w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div className="max-w-4xl mt-24">
                  <div className="inline-flex items-center gap-2 px-4 py-1 border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-full mb-6 backdrop-blur-sm">
                    <MdAutoAwesome size={14} /> New Arrival
                  </div>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-[1.1]">Architectural <br /> Metal Works.</h2>
                  <p className="text-white/70 text-sm md:text-lg mb-8 max-w-2xl mx-auto font-medium">Precision-crafted solutions serving visionary projects and architectural excellence.</p>
                  <button className="bg-[#f6423a] text-white px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#0d2360] transition-all shadow-xl">Learn More</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* 2. Compact Control Bar (Re-Layouted) */}
      <div className="relative -mt-12 z-30 px-6 md:px-10 lg:px-15 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4">

          {/* Horizontal Category Pills */}
          <div className={`transition-all duration-500 ease-out overflow-hidden ${isFilterOpen ? 'max-h-24 opacity-100 mb-2' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-2 overflow-x-auto pb-3 px-1 scrollbar-hide">
              <button
                onClick={() => { setActiveFilter('All'); setIsFilterOpen(false) }}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md border
                                    ${activeFilter === 'All' ? 'bg-[#071236] border-[#071236] text-white' : 'bg-white text-slate-500 border-slate-100 hover:border-[#f6423a]'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveFilter(cat.slug); setIsFilterOpen(false) }}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md border
                                        ${activeFilter === cat.slug ? 'bg-[#071236] border-[#071236] text-white' : 'bg-white text-slate-500 border-slate-100 hover:border-[#f6423a]'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Search Station */}
          <div className="relative">
            <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-xl flex items-center transition-all">
              <div className="w-10 h-10 flex items-center justify-center text-slate-300">
                <MdSearch size={22} />
              </div>
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-2 py-3 text-[14px] font-bold outline-none border-none focus:ring-0 placeholder:text-slate-300"
              />

              <div className="h-6 w-[1px] bg-slate-100 mx-2 hidden md:block" />

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all
                                    ${isFilterOpen ? 'bg-[#071236] text-white shadow-lg' : 'text-slate-500 hover:text-[#f6423a]'}`}
              >
                <MdFilterList size={18} />
                {activeFilter === 'All' ? 'Filter' : activeFilter}
                <MdKeyboardArrowDown className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Search Result Dropdown (Daraz Style) */}
            {searchQuery.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[9px] font-black text-[#f6423a] uppercase tracking-widest">Inventory Results</p>
                    <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-red-500 transition-colors">
                      <MdClose size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    {productsLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-3 animate-pulse">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex-shrink-0" />
                          <div className="flex-1 py-1">
                            <div className="h-3 w-1/4 bg-slate-50 rounded mb-2" />
                            <div className="h-4 w-2/3 bg-slate-100 rounded" />
                          </div>
                        </div>
                      ))
                    ) : allFilteredProducts.length > 0 ? (
                      allFilteredProducts.slice(0, 8).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => router.push(`/products/${product.slug}`)}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer group transition-all"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-50">
                            <img src={getApiImageUrl(product.primary_image) || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{typeof product.category === 'string' ? product.category : product.category?.name}</p>
                            <h5 className="text-[13px] font-black text-[#071236] uppercase tracking-tight truncate group-hover:text-[#f6423a] transition-colors leading-tight">{product.name}</h5>
                            <p className="text-[#f6423a] text-[11px] font-black tracking-tight mt-1">
                              {product.is_price_visible ? `Rs. ${parseFloat(product.base_price).toLocaleString()}` : 'Price on Quote'}
                            </p>
                          </div>
                          <MdArrowForward size={14} className="text-slate-200 group-hover:text-[#f6423a] transition-all" />
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">No technical matches.</p>
                      </div>
                    )}
                  </div>

                  {allFilteredProducts.length > 8 && (
                    <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set('search', searchQuery);
                          window.scrollTo({ top: 800, behavior: 'smooth' });
                        }}
                        className="text-[9px] font-black text-slate-900 uppercase tracking-widest hover:text-[#f6423a] transition-all flex items-center justify-center gap-2 mx-auto"
                      >
                        See All {allFilteredProducts.length} Results <MdLaunch size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Featured Section */}
      {activeFilter === 'All' && !searchQuery && (
        <section className="pt-24 pb-12 px-6 md:px-10 lg:px-15">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-10">
              <div className="flex items-center gap-3 mb-2">
                <MdAutoAwesome className="text-[#f6423a]" size={20} />
                <h3 className="text-[10px] font-black text-[#f6423a] uppercase tracking-[0.4em]">Signature Series</h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#071236] uppercase tracking-tighter leading-none">Curated Selection.</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {productsLoading || !initialFetchDone ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="aspect-square bg-slate-50 rounded-[2.5rem] animate-pulse" />
                    <div className="h-4 w-2/3 bg-slate-50 rounded" />
                  </div>
                ))
              ) : (
                featuredProducts.map(product => (
                  <MinimalProductCard key={product.id} product={product} router={router} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. Main Catalog Grid */}
      <section className="pt-16 pb-40 px-6 md:px-10 lg:px-15 catalog-grid">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-10 border-b border-slate-100">
            <div>
              <h3 className="text-4xl font-black text-[#071236] uppercase tracking-tighter leading-none mb-3">The Collection</h3>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Inventory / {activeFilter} / {allFilteredProducts.length} Results</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['newest', 'popular', 'price-low', 'price-high'].map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s as any)}
                  className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border
                                        ${sortBy === s ? 'bg-[#071236] border-[#071236] text-white' : 'bg-transparent border-slate-100 text-slate-300 hover:border-slate-300'}`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {productsLoading || !initialFetchDone ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 gap-y-12">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="aspect-square bg-slate-50 rounded-[2.5rem] animate-pulse" />
                  <div className="h-3 w-1/3 bg-slate-50 rounded" />
                  <div className="h-4 w-2/3 bg-slate-50 rounded" />
                </div>
              ))}
            </div>
          ) : allFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 gap-y-12">
              {allFilteredProducts.map((product) => (
                <MinimalProductCard key={product.id} product={product} router={router} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">No records matching <br /> <span className="text-[#f6423a]">{searchQuery}</span></p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function MinimalProductCard({ product, router }: { product: any, router: any }) {
  return (
    <div
      onClick={() => router.push(`/products/${product.slug}`)}
      className="product-card-minimal group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square mb-5 rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 transition-all duration-500 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] group-hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-[#f6423a]">
        <img
          src={getApiImageUrl(product.primary_image) || ''}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur rounded-full text-[#f6423a] opacity-0 group-hover:opacity-100 transition-all shadow-sm">
          <MdAddShoppingCart size={14} />
        </div>
        <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-[#071236] text-white p-2.5 rounded-xl shadow-xl">
            <MdArrowForward size={18} />
          </div>
        </div>
      </div>

      <div className="px-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f6423a]" />
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verified Work</p>
        </div>
        <h4 className="text-[12px] font-black text-[#071236] leading-tight mb-2 group-hover:text-[#f6423a] transition-colors line-clamp-2 uppercase tracking-tight">
          {product.name}
        </h4>
        <div className="flex items-center justify-between">
          <p className="text-[#071236] font-black text-[12px] tracking-tight">
            {product.is_price_visible ? (
              <><span className="text-[#f6423a] text-[10px] mr-0.5">Rs.</span>{parseFloat(product.base_price).toLocaleString()}</>
            ) : 'Custom Quote'}
          </p>
          <div className="flex items-center gap-1 opacity-40">
            <MdStar className="text-amber-500" size={10} />
            <span className="text-[9px] font-bold text-slate-500">{product.average_rating || '5.0'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
