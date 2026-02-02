'use client';

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchStoreServices, fetchProducts } from '@/utils/lib/redux/features/products/productSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    MdArrowForward,
    MdHandshake,
    MdEngineering,
    MdOutlineVilla,
    MdPrecisionManufacturing,
    MdChair,
    MdCollections,
    MdConstruction,
    MdBusiness,
    MdLightbulb,
    MdKeyboardArrowDown
} from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import { getApiImageUrl } from '@/utils/imageUrl';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ReactNode> = {
    'MdOutlineVilla': <MdOutlineVilla size={32} />,
    'MdPrecisionManufacturing': <MdPrecisionManufacturing size={32} />,
    'MdChair': <MdChair size={32} />,
    'MdCollections': <MdCollections size={32} />,
    'MdConstruction': <MdConstruction size={32} />,
    'MdBusiness': <MdBusiness size={32} />,
    'MdEngineering': <MdEngineering size={32} />,
    'MdLightbulb': <MdLightbulb size={32} />,
};

const getIcon = (name: string) => iconMap[name] || <MdEngineering size={32} />;

const backgroundImages = [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1920',
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1920'
];

interface ServiceSlideshowProps {
    images?: { image: string }[];
    fallbackImage: string;
    index: number;
}

const ServiceSlideshow: React.FC<ServiceSlideshowProps> = ({ images, fallbackImage, index }) => {
    const [currentIdx, setCurrentIdx] = React.useState(0);
    const hasMultipleImages = images && images.length > 1;

    React.useEffect(() => {
        if (!hasMultipleImages) return;

        const interval = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % images!.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [hasMultipleImages, images]);

    const overlayGradient = index % 2 === 0
        ? 'bg-gradient-to-r from-[var(--background)] via-color-mix(in srgb, var(--background), transparent 30%) to-transparent'
        : 'bg-gradient-to-l from-[var(--background)] via-color-mix(in srgb, var(--background), transparent 30%) to-transparent';

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {images && images.length > 0 ? (
                images.map((img, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === currentIdx ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${getApiImageUrl(img.image)})` }}
                    />
                ))
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${fallbackImage})` }}
                />
            )}
            {overlayGradient && <div className={`absolute inset-0 ${overlayGradient} z-10`} />}
        </div>
    );
};

export default function ServicesClient() {
    const dispatch = useDispatch();
    const { services, servicesLoading } = useSelector((state: RootState) => state.products);
    const [isGsapReady, setIsGsapReady] = React.useState(false);

    useEffect(() => {
        dispatch(fetchStoreServices() as any);
        dispatch(fetchProducts({ page_size: 1 }) as any);
    }, [dispatch]);

    // Setup Native CSS Scroll Snap on document level
    useEffect(() => {
        const html = document.documentElement;
        const originalSnapType = html.style.scrollSnapType;
        const originalScrollBehavior = html.style.scrollBehavior;
        const originalHeight = html.style.height;
        const originalOverflow = html.style.overflowY;

        html.style.scrollSnapType = 'y mandatory';
        html.style.scrollBehavior = 'smooth';
        html.style.height = '100vh';
        html.style.overflowY = 'scroll';
        document.body.style.scrollSnapType = 'y mandatory';

        return () => {
            html.style.scrollSnapType = originalSnapType;
            html.style.scrollBehavior = originalScrollBehavior;
            html.style.height = originalHeight;
            html.style.overflowY = originalOverflow;
            document.body.style.scrollSnapType = '';
        };
    }, []);

    useEffect(() => {
        if (servicesLoading) return;

        const initGsap = () => {
            const sections = gsap.utils.toArray<HTMLElement>('.snap-section');

            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

            sections.forEach((section) => {
                // Parallax background
                const bgImage = section.querySelector('.parallax-bg');
                if (bgImage) {
                    gsap.to(bgImage, {
                        yPercent: 30,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                            invalidateOnRefresh: true
                        }
                    });
                }

                // Content animations
                const content = section.querySelectorAll('.content-fade');
                if (content.length > 0) {
                    gsap.fromTo(content,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            stagger: 0.15,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 60%',
                                toggleActions: 'play none none reverse',
                                invalidateOnRefresh: true
                            }
                        }
                    );
                }
            });

            ScrollTrigger.refresh();

            setTimeout(() => {
                setIsGsapReady(true);
            }, 200);
        };

        const timer = setTimeout(initGsap, 500);

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            clearTimeout(timer);
        };
    }, [servicesLoading, services.length]);

    return (
        <div className="bg-[var(--background)] min-h-screen relative">

            {/* Skeleton Overlay */}
            {(!isGsapReady || servicesLoading) && (
                <div className="fixed inset-0 z-[100] bg-[var(--background)]">
                    <Navbar forceTransparent={true} />
                    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/50 animate-pulse" />
                        <div className="relative z-20 w-full max-w-4xl mx-auto px-5 flex flex-col items-center translate-y-[100px]">
                            <div className="w-32 h-6 bg-white/5 rounded-full mb-6 animate-pulse" />
                            <div className="w-full max-w-2xl h-16 bg-white/5 rounded-2xl mb-4 animate-pulse" />
                            <div className="w-3/4 max-w-lg h-16 bg-white/5 rounded-2xl mb-8 animate-pulse" />
                            <div className="flex gap-4">
                                <div className="w-40 h-12 bg-white/5 rounded-full animate-pulse" />
                                <div className="w-40 h-12 bg-white/5 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="absolute bottom-10 right-20 flex items-center gap-4">
                            <div className="w-8 h-3 bg-white/5 rounded animate-pulse" />
                            <div className="w-12 h-[1px] bg-white/5" />
                            <div className="w-16 h-3 bg-white/5 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            {/* Actual Content */}
            <div className={`transition-opacity duration-700 ${isGsapReady && !servicesLoading ? 'opacity-100' : 'opacity-0'}`}>
                <Navbar />

                {/* 1. Hero Section with Video */}
                <section
                    className="snap-section relative h-screen w-full flex items-center justify-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 h-[140%] -top-[20%] w-full">
                        <div className="absolute inset-0 w-full h-full">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src="/intro.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-[var(--background)]/40 z-10" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--background),transparent_2%)_0%,color-mix(in srgb,var(--background),transparent_60%)_50%,transparent_80%)] z-10 pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />

                            {/* Portfolio Glow Elements - Calibrated Vibrancy */}
                            <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#f6423a]/12 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none z-10" />
                            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-600/18 blur-[180px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none z-10" />
                            <div className="absolute top-1/2 left-1/2 w-[40vw] h-[40vw] bg-blue-400/10 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-60" />
                        </div>
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5 text-center">
                        <div className="max-w-4xl mx-auto content-fade flex flex-col items-center translate-y-[60px] md:translate-y-[100px]">
                            <span className="inline-block px-4 py-1.5 bg-[#f6423a] text-white text-[10px] uppercase tracking-widest rounded-full mb-6 font-bold shadow-lg shadow-red-900/20">
                                Full-Scale Fabrication
                            </span>
                            <h1 className="text-3xl md:text-[55px] font-bold text-white mb-6 leading-tight drop-shadow-xl shadow-black">
                                Our Specialized <br />
                                <span className="text-[#f6423a]">Metal Services.</span>
                            </h1>
                            <p className="text-gray-100 font-normal text-base md:text-lg leading-relaxed mb-8 max-w-2xl drop-shadow-md">
                                From large-scale industrial structures to bespoke metal furniture, we deliver excellence through decades of engineering expertise.
                            </p>
                            <div className="flex gap-4 cursor-pointer" onClick={() => {
                                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                            }}>
                                <a href="/getquote" className="bg-[#f6423a] hover:bg-[#e03229] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-900/20">
                                    Request Quote
                                </a>
                                <a href="/portfolio" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all border border-white/20">
                                    View Work
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-bounce text-white/50 cursor-pointer"
                        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
                        <MdKeyboardArrowDown size={32} />
                        <span className="sr-only">Scroll Down</span>
                    </div>
                </section>

                {/* 2. Service Sections */}
                {services.map((service, index) => (
                    <section
                        key={service.id}
                        className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                    >
                        <div className="parallax-bg absolute inset-0 z-0 will-change-transform h-[140%] -top-[20%] w-full">
                            <ServiceSlideshow
                                images={service.images}
                                fallbackImage={(service.image && getApiImageUrl(service.image)) || backgroundImages[(index + 1) % backgroundImages.length]}
                                index={index}
                            />
                            {/* Portfolio Glow Elements - Calibrated Vibrancy */}
                            <div className={`absolute ${index % 2 === 0 ? 'top-0 right-0' : 'bottom-0 left-0'} w-[60vw] h-[60vw] bg-[#f6423a]/10 blur-[180px] rounded-full z-10 pointer-events-none opacity-70`} />
                            <div className={`absolute ${index % 2 === 0 ? 'bottom-0 left-0' : 'top-0 right-0'} w-[50vw] h-[50vw] bg-blue-600/12 blur-[160px] rounded-full z-10 pointer-events-none opacity-70`} />
                            <div className="absolute top-1/2 left-1/2 w-[35vw] h-[35vw] bg-blue-400/8 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-40" />
                        </div>

                        <div className="relative z-10 w-full max-w-[1920px] mx-auto lg:px-20 md:px-10 px-5">
                            <div className={`max-w-2xl flex flex-col ${index % 2 === 0 ? 'items-start text-left' : 'ml-auto items-end text-right'} mt-24 md:mt-40`}>
                                <div className="content-fade mb-6">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-[#f6423a] rounded-2xl shadow-lg shadow-red-900/30 overflow-hidden`}>
                                        {(service.images && service.images.length > 0) ? (
                                            <img src={getApiImageUrl(service.images[0].image) || ''} alt={service.title || ''} className="w-full h-full object-cover rounded-2xl" />
                                        ) : service.image ? (
                                            <img src={getApiImageUrl(service.image) || ''} alt={service.title || ''} className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="text-white">
                                                {getIcon(service.icon_name || '')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="content-fade">
                                    <span className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-full mb-4 border border-white/10">
                                        Service {index + 1}
                                    </span>
                                </div>

                                <h2 className="content-fade text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                                    {service.title || ''}
                                </h2>

                                <p className={`content-fade text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium ${index % 2 !== 0 ? 'ml-auto' : ''}`}>
                                    {service.description || 'Professional metal fabrication service for industrial and residential needs.'}
                                </p>

                                <div className="content-fade flex gap-4">
                                    <Link
                                        href={`/getquote?service=${service.id}`}
                                        className="bg-[#f6423a] hover:bg-[#e03229] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
                                    >
                                        Inquire Now
                                    </Link>
                                    <Link
                                        href={`/portfolio?category=${service.category || ''}`}
                                        className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10"
                                    >
                                        Work
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={`absolute bottom-10 z-20 hidden md:block ${index % 2 === 0 ? 'right-20' : 'left-20'}`}>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">0{index + 1}</span>
                                <div className="w-12 h-[1px] bg-white/10" />
                                <span className="text-[10px] font-black text-[#f6423a] uppercase tracking-[0.3em]">Services</span>
                            </div>
                        </div>
                    </section>
                ))}

                {/* 3. Partnerships Section */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 will-change-transform h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#071236] via-[#071236]/95 to-[#071236]/80" />
                    </div>

                    <div className="relative z-10 w-full max-w-[1920px] mx-auto lg:px-15 md:px-10 px-5">
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <div className="max-w-3xl content-fade text-center translate-y-[80px] md:translate-y-[120px]">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f6423a]/10 border border-[#f6423a] rounded-full mb-6 mx-auto">
                                    <MdHandshake className="text-[#f6423a]" />
                                    <span className="text-[#f6423a] text-[10px] font-black uppercase tracking-widest">
                                        B2B Solutions
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                    Strategic Vendorship & <br />
                                    <span className="text-[#f6423a]">Long-Term Partnerships.</span>
                                </h2>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 mx-auto max-w-2xl">
                                    We are looking to collaborate with construction firms, interior designers, and architects for long-term manufacturing agreements. As your dedicated fabrication partner, we guarantee priority production, consistent quality, and scalable supply for all your projects.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <a href="/getquote" className="bg-white text-[#071236] hover:bg-gray-100 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all">
                                        Become a Partner
                                    </a>
                                    <a href="/portfolio" className="border border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all">
                                        Our Portfolio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="snap-section w-full bg-[#071236]" style={{ scrollSnapAlign: 'end' }}>
                    <Footer />
                </section>
            </div>
        </div>
    );
}
