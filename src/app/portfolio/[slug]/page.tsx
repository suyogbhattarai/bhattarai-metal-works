'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchPortfolioProjects } from '@/utils/lib/redux/features/portfolio/portfolioSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    MdLocationOn,
    MdPerson,
    MdCalendarToday,
    MdArrowBack,
    MdEngineering,
    MdCheckCircle
} from 'react-icons/md';
import { getApiImageUrl } from '@/utils/imageUrl';
import gsap from 'gsap';

export default function PortfolioItemPage() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { projects, loading } = useSelector((state: RootState) => state.portfolio);

    const project = projects.find(p => p.slug === slug);

    useEffect(() => {
        if (!project) {
            dispatch(fetchPortfolioProjects({}) as any);
        }
    }, [dispatch, project]);

    useEffect(() => {
        if (project) {
            gsap.fromTo('.project-detail-animate',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [project]);

    if (loading) return <div className="min-h-screen bg-[#071236] flex items-center justify-center text-[#f6423a]">Initializing Technical Specs...</div>;
    if (!project) return <div className="min-h-screen bg-[#071236] flex items-center justify-center text-white">Project Not Found</div>;

    return (
        <div className="bg-[#071236] min-h-screen text-white">
            <Navbar />

            {/* Project Header */}
            <header className="relative pt-32 pb-20 px-6 md:px-10 lg:px-15 overflow-hidden mt-10">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#f6423a]/10 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <button
                        onClick={() => router.push('/portfolio')}
                        className="project-detail-animate flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#f6423a] mb-8 hover:tracking-[0.4em] transition-all"
                    >
                        <MdArrowBack size={16} /> Back to Showcase
                    </button>

                    <h1 className="project-detail-animate text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                        {project.title}
                    </h1>

                    <div className="project-detail-animate flex flex-wrap justify-center gap-6 md:gap-12">
                        <div className="flex items-center gap-3">
                            <MdLocationOn className="text-[#f6423a]" size={20} />
                            <span className="text-xs font-black uppercase tracking-widest text-white/60">{project.location || 'Nepal'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MdPerson className="text-[#f6423a]" size={20} />
                            <span className="text-xs font-black uppercase tracking-widest text-white/60">Client: {project.client_name || 'Corporate'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MdCalendarToday className="text-[#f6423a]" size={20} />
                            <span className="text-xs font-black uppercase tracking-widest text-white/60">{project.completion_date || 'Showcase Project'}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Showcase Gallery */}
            <main className="max-w-7xl mx-auto px-6 md:px-10 lg:px-15 pb-40">
                {/* Hero Image */}
                <div className="project-detail-animate relative rounded-[3rem] overflow-hidden mb-20 shadow-2xl shadow-black/40">
                    <img
                        src={getApiImageUrl(project.primary_image?.image || project.images[0]?.image) || ''}
                        alt={project.title}
                        className="w-full h-auto min-h-[400px] object-cover"
                    />
                </div>

                {/* Narrative Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="project-detail-animate">
                            <h2 className="text-sm font-black text-[#f6423a] uppercase tracking-[0.3em] mb-4">Project Narrative</h2>
                            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
                                {project.description}
                            </p>
                        </div>

                        <div className="project-detail-animate grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
                                <h4 className="text-[10px] font-black text-[#f6423a] uppercase tracking-widest mb-4">Technical Scope</h4>
                                <ul className="space-y-4">
                                    {['Precision Fabrication', 'Structural Engineering', 'Architectural Design', 'Site Installation'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/60">
                                            <MdCheckCircle className="text-green-500" size={16} /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 bg-[#f6423a] rounded-[2rem] shadow-xl shadow-red-900/40">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Project Highlights</h4>
                                <p className="text-xs font-medium text-white/80 leading-relaxed">
                                    Our design studio utilized advanced CAD/CAM modeling to ensure sub-millimeter precision during the fabrication phase.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="project-detail-animate space-y-8">
                        <div className="p-10 bg-[#111e48] rounded-[2.5rem] border border-white/5 sticky top-24">
                            <MdEngineering className="text-[#f6423a] mb-6" size={40} />
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Interested in similar work?</h3>
                            <p className="text-xs text-white/50 mb-8 leading-relaxed">Let's discuss how our technical expertise can be applied to your specific architectural requirements.</p>
                            <button
                                onClick={() => router.push('/getquote')}
                                className="w-full py-4 bg-[#f6423a] hover:bg-white hover:text-[#f6423a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
                            >
                                Get Technical Quote
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Gallery */}
                {project.images.length > 1 && (
                    <div className="project-detail-animate space-y-12">
                        <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.4em] text-center">Detailed Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {project.images.filter(img => !img.is_primary).map((img, i) => (
                                <div key={i} className="rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#f6423a]/40 transition-all duration-500 group">
                                    <img
                                        src={getApiImageUrl(img.image) || ''}
                                        className="w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
