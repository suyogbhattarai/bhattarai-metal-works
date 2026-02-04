'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MdCheckCircle, MdEngineering, MdDesignServices, MdHandyman } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger);

const backgroundImages = [
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1920',
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1920'
];

export default function AboutClient() {
    const [isGsapReady, setIsGsapReady] = useState(false);

    // 1. Scroll Snap Initialization (Document Level)
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

    // 2. GSAP & Parallax Initialization
    useEffect(() => {
        // Delay initialization to ensure DOM is fully rendered and styles applied
        const initGsap = () => {
            const sections = gsap.utils.toArray<HTMLElement>('.snap-section');

            // Clean up previous triggers to avoid duplicates
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

            sections.forEach((section) => {
                // Parallax background logic (Y movement)
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

                // Text Fade-In logic (scroll triggered)
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
                                start: 'top 80%',
                                toggleActions: 'play none none reverse',
                                invalidateOnRefresh: true
                            }
                        }
                    );
                }
            });

            // Ensure everything is calculated correctly
            ScrollTrigger.refresh();

            // Set ready after a small delay to ensure content is positioned
            setTimeout(() => {
                setIsGsapReady(true);
            }, 200);
        };

        // Run after component mounts
        const timer = setTimeout(initGsap, 500);

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="bg-[var(--background)] min-h-screen relative">

            {/* Skeleton Overlay - Fixed on top until GSAP is ready */}
            {!isGsapReady && (
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

            {/* Actual Content - Always in DOM but invisible while initializing */}
            <div className={`transition-opacity duration-700 ${isGsapReady ? 'opacity-100' : 'opacity-0'}`}>
                <Navbar />

                {/* 1. Hero Section */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 will-change-transform h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[0]})` }}
                        />
                        <div className="absolute inset-0 bg-[var(--background)]/45 z-10" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in srgb,var(--background),transparent_2%)_0%,color-mix(in srgb,var(--background),transparent_60%)_50%,transparent_80%)] z-10 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />

                        {/* Portfolio Glow Elements - Calibrated Vibrancy */}
                        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#f6423a]/14 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none z-10" />
                        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-600/18 blur-[180px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none z-10" />
                        <div className="absolute top-1/2 left-1/2 w-[50vw] h-[50vw] bg-blue-400/12 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-3xl mx-auto flex flex-col items-center text-center translate-y-[20px] md:translate-y-[40px]">
                            <span className="content-fade inline-block px-4 py-1.5 bg-[#f6423a] text-white text-[8px] font-black uppercase tracking-widest rounded-full mb-6 shadow-lg shadow-red-900/20">
                                Our Legacy
                            </span>
                            <h1 className="content-fade text-3xl md:text-[55px] font-black text-white mb-6 leading-tight drop-shadow-xl shadow-black">
                                Engineering Strength, <br />
                                <span className="text-[#f6423a]">Designing Excellence.</span>
                            </h1>
                            <p className="content-fade text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl drop-shadow-md font-medium">
                                Bhattarai Metal Works is Nepal's premier destination for high-end metal fabrication, structural construction, and bespoke furniture solutions.
                            </p>
                            <div className="content-fade flex gap-4">
                                <a href="/getquote" className="bg-[#f6423a] hover:bg-[#e03229] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-900/20">
                                    Get Started
                                </a>
                                <a href="/portfolio" className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10">
                                    View Portfolio
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-20 z-20 hidden md:block">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">01</span>
                            <div className="w-12 h-[1px] bg-white/10" />
                            <span className="text-[10px] font-black text-[#f6423a] uppercase tracking-[0.3em]">About Us</span>
                        </div>
                    </div>
                </section>

                {/* 2. Who We Are */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 will-change-transform h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[1]})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-[var(--background)] via-color-mix(in srgb, var(--background), transparent 30%) to-transparent z-10" />

                        {/* Portfolio Glow Elements - Calibrated Vibrancy */}
                        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#f6423a]/12 blur-[200px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none z-10" />
                        <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] bg-blue-600/15 blur-[180px] rounded-full translate-x-1/3 pointer-events-none z-10" />
                        <div className="absolute top-1/2 left-1/3 w-[35vw] h-[35vw] bg-blue-400/10 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-2xl ml-auto text-right flex flex-col items-end mt-24 md:mt-40">
                            <h2 className="content-fade text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">
                                Who We Are
                            </h2>
                            <p className="content-fade text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium">
                                Founded with a vision to redefine metalwork in Nepal, we have grown from a local workshop into a full-scale engineering and design powerhouse. Our team consists of highly skilled workers, seasoned engineers, and creative designers dedicated to delivering durability without compromising on aesthetics.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-xl">
                                <div className="content-fade flex items-center justify-end gap-4 p-5 bg-white/5 backdrop-blur rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                                    <div>
                                        <h4 className="font-black text-white text-[10px] uppercase mb-1 tracking-widest">Expert Engineering</h4>
                                        <p className="text-gray-400 text-[10px]">Structural integrity at every weld.</p>
                                    </div>
                                    <MdEngineering className="text-[#f6423a] shrink-0" size={32} />
                                </div>
                                <div className="content-fade flex items-center justify-end gap-4 p-5 bg-white/5 backdrop-blur rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                                    <div>
                                        <h4 className="font-black text-white text-[10px] uppercase mb-1 tracking-widest">Design Studio</h4>
                                        <p className="text-gray-400 text-[10px]">Transforming ideas into 3D blueprints.</p>
                                    </div>
                                    <MdDesignServices className="text-[#f6423a] shrink-0" size={32} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-20 z-20 hidden md:block">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">02</span>
                            <div className="w-12 h-[1px] bg-white/10" />
                            <span className="text-[10px] font-black text-[#f6423a] uppercase tracking-[0.3em]">Heritage</span>
                        </div>
                    </div>
                </section>

                {/* 3. Core Values */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[2]})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-color-mix(in srgb, var(--background), transparent 30%) to-transparent z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-4xl mt-24 md:mt-40">
                            <h2 className="content-fade text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">
                                Our Core Values
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="content-fade p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="w-14 h-14 bg-[#f6423a] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/20">
                                        <MdHandyman size={28} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Skilled Craftsmanship</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                        Our workforce is the backbone of our excellence. We employ the most skilled welders and fabricators in the region.
                                    </p>
                                </div>

                                <div className="content-fade p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="w-14 h-14 bg-[#f6423a] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/20">
                                        <MdCheckCircle size={28} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Unmatched Quality</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                        From raw steel to final coat of paint, quality control is embedded in every step of our fabrication process.
                                    </p>
                                </div>

                                <div className="content-fade p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="w-14 h-14 bg-[#f6423a] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/20">
                                        <MdDesignServices size={28} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Custom Solutions</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                        Our design studio works closely with you to create tailored metal solutions that fit your space perfectly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-20 z-20 hidden md:block">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">03</span>
                            <div className="w-12 h-[1px] bg-white/10" />
                            <span className="text-[10px] font-black text-[#f6423a] uppercase tracking-[0.3em]">Values</span>
                        </div>
                    </div>
                </section>

                {/* 4. Experience Section */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[3]})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-[var(--background)] via-color-mix(in srgb, var(--background), transparent 30%) to-transparent z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-3xl ml-auto text-right flex flex-col items-end">
                            <div className="content-fade inline-block p-10 md:p-14 rounded-[3rem] bg-[#f6423a] mb-10 shadow-2xl shadow-red-900/30">
                                <h3 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter">15+</h3>
                                <p className="text-white/90 font-black text-xs uppercase tracking-[0.3em]">Years Legacy</p>
                            </div>

                            <h2 className="content-fade text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                                A Legacy of <span className="text-[#f6423a]">Excellence.</span>
                            </h2>
                            <p className="content-fade text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-2xl font-medium">
                                Over 15 years of delivering world-class metal fabrication services across Nepal. From small residential projects to large industrial installations, we've built a reputation for reliability, precision, and innovation.
                            </p>

                            <div className="content-fade flex flex-wrap gap-4 justify-end">
                                <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                                    <span className="text-white font-black text-[10px] uppercase tracking-wider">500+ Projects</span>
                                </div>
                                <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                                    <span className="text-white font-black text-[10px] uppercase tracking-wider">100+ Clients</span>
                                </div>
                                <div className="px-6 py-3 bg-[#f6423a]/10 backdrop-blur-md rounded-full border border-[#f6423a]/30">
                                    <span className="text-[#f6423a] font-black text-[10px] uppercase tracking-wider">ISO Certified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-20 z-20 hidden md:block">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">04</span>
                            <div className="w-12 h-[1px] bg-white/10" />
                            <span className="text-[10px] font-black text-[#f6423a] uppercase tracking-[0.3em]">Experience</span>
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
