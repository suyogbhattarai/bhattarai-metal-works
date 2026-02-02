'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchPortfolioProjects } from '@/utils/lib/redux/features/portfolio/portfolioSlice';
import Navbar from '@/components/Navbar';
import {
  MdArrowForward,
  MdEngineering,
  MdLocationOn,
  MdCalendarToday,
  MdMoreHoriz
} from 'react-icons/md';
import { getApiImageUrl } from '@/utils/imageUrl';

export default function PortfolioClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state: RootState) => state.portfolio);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch(fetchPortfolioProjects({}) as any);
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight;
      const index = Math.round(scrollY / height);
      setActiveIndex(index);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [projects]);

  // Set ready status when loading finishes and projects are populated
  useEffect(() => {
    if (!loading && projects.length > 0) {
      const timer = setTimeout(() => setIsReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, projects]);

  return (
    <div className="bg-[var(--background)] h-screen overflow-hidden flex flex-col relative text-white">
      {/* Portfolio Skeleton Loader - Keeping #071236 as requested */}
      {(!isReady || (loading && projects.length === 0)) && (
        <div className="fixed inset-0 z-[100] bg-[var(--background)] flex flex-col text-white">
          <Navbar forceTransparent={true} />
          <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center mt-32 h-[75vh]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 w-full items-center">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <div className="w-32 h-6 bg-white/5 rounded-full animate-pulse" />
                  <div className="w-full h-20 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                    <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="w-24 h-3 bg-white/5 rounded animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl animate-pulse" />
                    <div className="w-48 h-10 bg-white/5 rounded-lg animate-pulse" />
                  </div>
                </div>
                <div className="w-40 h-12 bg-white/5 rounded-full animate-pulse mt-4" />
              </div>
              {/* Right Column Skeleton */}
              <div className="lg:col-span-7 grid grid-cols-4 grid-rows-4 gap-4 aspect-[4/3] lg:aspect-auto lg:h-[70vh]">
                <div className="col-span-3 row-span-3 bg-white/5 rounded-[3rem] animate-pulse" />
                <div className="col-span-1 row-span-1 bg-white/5 rounded-[2rem] animate-pulse" />
                <div className="col-span-1 row-span-2 bg-white/5 rounded-[2rem] animate-pulse" />
                <div className="col-span-2 row-span-1 bg-white/5 rounded-[2rem] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Scroll Indication Skeleton */}
          <div className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      <Navbar />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Snap Container */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      >
        {projects.length > 0 ? (
          projects.map((project, idx) => (
            <section
              key={project.id}
              className="h-screen w-full snap-start relative flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-hidden"
            >
              {/* Abstract Background Elements - Increased intensity */}
              <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#f6423a]/8 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-600/8 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] bg-blue-400/3 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Main Content Container */}
              <div className="w-full max-w-7xl h-[75vh] mt-32 flex items-center relative z-10 transition-all duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full h-full max-h-full">

                  {/* Information Column (Left) - Increased width to prevent text cut-off */}
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-8 order-2 lg:order-1 h-full py-8">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f6423a]/10 border border-[#f6423a]/20 rounded-full w-fit">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#f6423a]">Phase {idx + 1} // Showcase</span>
                      </div>
                      <h2 className="text-4xl md:text-6xl lg:text-[75px] font-black uppercase tracking-tighter leading-[0.85] text-white">
                        {project.title}
                      </h2>
                      <p className="text-sm md:text-base text-white/40 font-medium leading-[1.6] max-w-lg line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Handover Branding - Refined and Scaled Down */}
                    {project.client_name && (
                      <div className="flex flex-col gap-4 pt-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#f6423a]/60">Handovered to:</span>
                        <div className="flex items-center gap-4 group">
                          {project.client_logo && (
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 overflow-hidden flex-shrink-0 transition-all duration-500 group-hover:bg-white/20">
                              <img
                                src={getApiImageUrl(project.client_logo) || ''}
                                alt={project.client_name}
                                className="w-full h-full object-contain filter brightness-200"
                              />
                            </div>
                          )}
                          <span className="text-xl md:text-2xl font-black uppercase tracking-widest text-white group-hover:text-[#f6423a] transition-all">
                            {project.client_name}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={() => router.push(`/portfolio/${project.slug}`)}
                        className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-[#f6423a] transition-all bg-white/5 px-8 py-3.5 rounded-full border border-white/10"
                      >
                        Specs View
                        <MdArrowForward className="group-hover:translate-x-3 transition-transform" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Visual Bento (Right) - Reduced width to give text more room */}
                  <div className="lg:col-span-7 h-full max-h-[70vh] grid grid-cols-4 grid-rows-4 gap-4 order-1 lg:order-2 self-center overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <>
                        {/* Primary Viewport */}
                        <div className="col-span-3 row-span-3 rounded-[3rem] overflow-hidden border border-white/5 relative group h-full">
                          <img
                            src={getApiImageUrl(project.primary_image?.image || project.images[0].image) || ''}
                            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                            alt={project.title}
                          />

                          {/* Minimalist Watermark on Image */}
                          <div className="absolute bottom-8 left-8 flex gap-8 z-20 pointer-events-none">
                            <div className="flex items-center gap-2">
                              <MdLocationOn size={12} className="text-white/60" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{project.location || 'Nepal'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MdCalendarToday size={12} className="text-white/60" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{project.completion_date || 'Showcase'}</span>
                            </div>
                          </div>

                          {/* Darker shadow for visibility */}
                          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" />
                        </div>

                        {/* Secondary Viewports */}
                        {project.images.slice(1, 4).map((img, i) => (
                          <div
                            key={img.id}
                            className={`
                              rounded-[2rem] overflow-hidden border border-white/5 group relative h-full transition-all duration-500
                              ${i === 0 ? 'col-span-1 row-span-1' : i === 1 ? 'col-span-1 row-span-2' : 'col-span-2 row-span-1'}
                            `}
                          >
                            <img
                              src={getApiImageUrl(img.image) || ''}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              alt="Ancillary"
                            />
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="col-span-4 row-span-4 bg-white/5 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-white/5 h-full">
                        <MdEngineering size={64} />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="h-screen flex flex-col items-center justify-center bg-[#071236]">
            <MdMoreHoriz size={64} className="text-white/10 mb-6" />
            <h3 className="text-2xl font-black text-white/40 uppercase tracking-widest">Architecturing Gallery</h3>
          </div>
        )}
      </div>

      {/* Navigation Matrix */}
      <div className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-8">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              containerRef.current?.scrollTo({ top: i * containerRef.current!.clientHeight, behavior: 'smooth' });
            }}
            className="group relative flex items-center justify-center"
          >
            <div className={`
              w-1.5 h-1.5 rounded-full transition-all duration-500
              ${activeIndex === i ? 'bg-[#f6423a] scale-[2] shadow-[0_0_20px_rgba(246,66,58,1)]' : 'bg-white/10 hover:bg-white/40'}
            `} />
          </button>
        ))}
      </div>

    </div>
  );
}
