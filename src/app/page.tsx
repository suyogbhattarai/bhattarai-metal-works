'use client';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import {  GiMetalBar, GiChemicalDrop } from "react-icons/gi";
import { MdPrecisionManufacturing } from "react-icons/md";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { RiShapeLine } from "react-icons/ri";
import { FaLayerGroup, FaFire } from "react-icons/fa";
import { BiCut } from "react-icons/bi";
import { TbBoxMultiple } from "react-icons/tb";
import { BsGear } from "react-icons/bs";
import { IoMdHammer } from "react-icons/io";
import { GiMetalPlate } from "react-icons/gi";
import WhyChooseSection from "@/components/WhyChooseSection";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Home() {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const firstText = useRef<HTMLDivElement>(null);
  const secondText = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const serviceRow1Ref = useRef<HTMLDivElement>(null);
  const serviceRow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {


    // Service marquee animations
    if (serviceRow1Ref.current && serviceRow2Ref.current) {
      gsap.to(serviceRow1Ref.current, {
        x: '-50%',
        duration: 80,
        ease: 'none',
        repeat: -1,
      });

      gsap.to(serviceRow2Ref.current, {
        x: '0%',
        duration: 80,
        ease: 'none',
        repeat: -1,
        startAt: { x: '-50%' },
      });
    }

    // Scroll animations for sections
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: section,
            start: "top 10px",
          },
        }
      );
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const TEXT_START = 0.1;

      ScrollTrigger.matchMedia({
        // DESKTOP (lg and above - 1024px+)
        "(min-width: 1024px)": function () {
          const mainTl = gsap.timeline({
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: "top top",
              end: "+=200%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

      mainTl.to(videoRef.current, {
  scale: 0.9,
  borderRadius: "30px",
  height: "78vh",
  width: "53vw",
  y: "140px",
  x: "44.8vw",
  ease: "power2.inOut",
}, 0);
          mainTl.to(".video-overlay", {
  opacity: 0,
  ease: "power2.inOut",
}, 0);

          mainTl.to(".old-content", {
            scale: 0.5,
            y: "0%",
            x: "30vw",
            opacity: 0,
            ease: "power2.inOut",
          }, 0);

          mainTl.set(".old-content", { display: "none" }, 0.3);
          mainTl.set(".new-content", { display: "block" }, 0.1);

          mainTl.fromTo(".new-content",
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, ease: "power2.inOut" },
            0.1
          );

          mainTl.fromTo(".new-heading", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START);

          mainTl.fromTo(".new-heading-line-2", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.1);

          mainTl.fromTo(".new-subheading", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.2);

          mainTl.fromTo(".new-buttons", {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.3);

          mainTl.fromTo(".security-message", {
            opacity: 0,
            y: 40,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.4);
        },

        // TABLET (md to lg - 768px to 1023px)
        "(min-width: 768px) and (max-width: 1023px)": function () {
          const mainTl = gsap.timeline({
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: "top top",
              end: "+=200%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

     mainTl.to(videoRef.current, {
  scale: 0.95,
  borderRadius: "25px",
  height: "45vh",
  width: "95vw",
  y: "12vh",
  x: "0",
  ease: "power2.inOut",
}, 0);

mainTl.to(".video-overlay", {
  opacity: 0,
  ease: "power2.inOut",
}, 0);

          mainTl.to(".old-content", {
            scale: 0.6,
            y: "-80%",
            x: "-10%",
            opacity: 0,
            ease: "power2.inOut",
          }, 0);

          mainTl.set(".old-content", { display: "none" }, 0.3);
          mainTl.set(".new-content", { display: "block" }, 0.05);

          mainTl.fromTo(".new-content",
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, ease: "power2.inOut" },
            0.1
          );

          mainTl.fromTo(".new-heading", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START);

          mainTl.fromTo(".new-heading-line-2", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.1);

          mainTl.fromTo(".new-subheading", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.2);

          mainTl.fromTo(".new-buttons", {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.3);

          mainTl.fromTo(".security-message", {
            opacity: 0,
            y: 40,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.4);
        },

        // MOBILE (below md - under 768px)
        "(max-width: 767px)": function () {
          const mainTl = gsap.timeline({
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: "top top",
              end: "+=200%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

     mainTl.to(videoRef.current, {
  scale: 0.93,
  borderRadius: "20px",
  height: "35vh",
  width: "100vw",
  y: "10vh",
  x: "0",
  ease: "power2.inOut",
}, 0);

mainTl.to(".video-overlay", {
  opacity: 0,
  ease: "power2.inOut",
}, 0);

          mainTl.to(".old-content", {
            scale: 0.5,
            y: "-90%",
            x: "-15%",
            opacity: 0,
            ease: "power2.inOut",
          }, 0);

          mainTl.set(".old-content", { display: "none" }, 0.3);
          mainTl.set(".new-content", { display: "block" }, 0.05);

          mainTl.fromTo(".new-content",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, ease: "power2.inOut" },
            0.1
          );

          mainTl.fromTo(".new-heading", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START);

          mainTl.fromTo(".new-heading-line-2", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.1);

          mainTl.fromTo(".new-subheading", {
            opacity: 0,
            y: 60,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.2);

          mainTl.fromTo(".new-buttons", {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.3);

          mainTl.fromTo(".security-message", {
            opacity: 0,
            y: 40,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }, TEXT_START + 0.35);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx global>{`
      /* Swiper Custom Styles */
.mySwiper {
  width: 100%;
  padding: 50px 0;
}

.mySwiper .swiper-slide {
  background-position: center;
  background-size: cover;
  width: 500px;
  height: 400px;
}

.mySwiper .swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
}

.mySwiper .swiper-pagination-bullet {
  background: #f6423a;
  opacity: 0.5;
}

.mySwiper .swiper-pagination-bullet-active {
  opacity: 1;
  background: #f6423a;
}

@media (max-width: 768px) {
  .mySwiper .swiper-slide {
    width: 300px;
    height: 250px;
  }
}
        .text-metal-shine {
          background: linear-gradient(
            110deg,
            #4a4a4a 0%,
            #6b6b6b 10%,
            #8c8c8c 20%,
            #b8b8b8 30%,
            #e0e0e0 40%,
            #ffffff 50%,
            #e0e0e0 60%,
            #b8b8b8 70%,
            #8c8c8c 80%,
            #6b6b6b 90%,
            #4a4a4a 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          letter-spacing: 0.05em;
          filter: brightness(1.15) contrast(1.1) drop-shadow(0 0 6px rgba(255,255,255,0.3));
          transition: letter-spacing 0.2s ease;
        }

        .text-metal-shine.coral-active {
          background: #f6423a;
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .text-metal-shine::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          transform: skewX(-25deg);
          animation: sweepShine 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes sweepShine {
          0%, 100% { left: -100%; }
          50% { left: 200%; }
        }

        @media (max-width: 768px) {
          .text-metal-shine {
            font-size: 2.5rem !important;
          }
        }
      `}</style>

      <section
        ref={videoContainerRef}
        className="relative h-screen w-full overflow-hidden z-30"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute z-3 top-0 left-0 w-full h-full object-cover"
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
<div className="video-overlay absolute inset-0 z-[5] bg-[#010d3c]/40"></div>        <div className="absolute left-0 bottom-10 z-10 lg:px-15 md:px-10 sm:px-5 px-3 max-w-7xl w-full">
          <div className="old-content w-full md:px-0">
            <div className="mb-6">
              <h2 className="text-2xl text-white font-normal mb-5">Crafting Strength & Design</h2>
              <h1 className="text-3xl md:text-[55px] font-medium leading-tight text-[#f6423a]">
                Metal Fabrication Excellence in Nepal
              </h1> 
            </div>

            <p className="max-w-4xl font-normal text-base md:text-lg text-white/90 mb-8">
              We specialize in transforming raw steel and metal into durable,
              functional, and artistic structures — serving homes, businesses,
              and visionary projects all across Nepal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
              <button className="py-3 px-8 bg-[#f6423a] hover:bg-[#e03229] text-white rounded-full transition text-sm md:text-base">
                Explore Our Work
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-full hover:bg-white/10 transition text-sm md:text-base">
                Contact Us
              </button>
            </div>
          </div>
        </div>
        
        <div className="new-content  lg:px-15 md:px-10 sm:px-5 px-3 absolute lg:top-[27%] md:top-[52%] top-[47%] hidden w-full lg:w-[54%] md:w-[90%]">
          <div className="mb-6">
            <h1 className="text-2xl md:text-[34px] lg:text-[38px] font-bold leading-relaxed">
              <span className="new-heading text-[#f6423a]">Scalable Manufacturing Services</span>
              <span className="new-heading-line-2 text-white"> for Engineering Businesses</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-base md:text-lg lg:text-xl text-white/90 new-subheading lg:w-[84%] md:w-[90%] leading-relaxed">
              Ensure your business needs never outpace your production capabilities.
            </h2>
          </div>
        
          <div className="new-buttons flex flex-col sm:flex-row gap-3 md:gap-4 mb-7">
            <button className="py-3 px-6 md:px-8 bg-[#f6423a] hover:bg-[#e03229] text-white rounded-full text-sm md:text-base font-semibold transition">
              Instant Quote
            </button>
            <button className="px-6 md:px-8 py-3 bg-[#f6423a] hover:bg-[#e03229] text-white rounded-full text-sm md:text-base font-semibold transition">
              Production Quote
            </button>
          </div>

          <div className="security-message flex items-center gap-3">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white/70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-sm md:text-base text-white/80">All production files are secure and confidential.</p>
          </div>
        </div>
      </section>

      <main className="relative bg-gradient-to-b from-[#010d3c] to-gray-900 text-white">

 
<WhyChooseSection/>
        <section className="min-h-screen relative flex items-center justify-center px-5 md:px-20 py-20">
     
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="about-text ">
              <h2 className="text-5xl md:text-7xl font-bold text-[#f6423a] mb-6">
                <span className="text-white">Crafting</span> Excellence
              </h2>
              <p className="text-lg text-white/80 mb-4">
                For over a decade, we've been transforming Nepal's landscape
                with precision metal fabrication and welding services. From
                residential gates to commercial infrastructure, we bring your
                vision to life with unmatched craftsmanship.
              </p>
              <p className="text-lg text-white/80">
                Our team of skilled artisans combines traditional techniques
                with modern technology to deliver structures that stand the test
                of time.
              </p>
            </div>
            <div className="about-image grid grid-cols-2 gap-4">
              <div className="h-48 bg-[#f6423a]/20 rounded-lg"></div>
              <div className="h-48 bg-[#f6423a]/30 rounded-lg mt-8"></div>
              <div className="h-48 bg-[#f6423a]/30 rounded-lg -mt-8"></div>
              <div className="h-48 bg-[#f6423a]/20 rounded-lg"></div>
            </div>
          </div>
        </section>
<section className="relative min-h-screen overflow-hidden px-5 md:px-20 bg-[#010d3c]">
             <div className="flex bg-[#f6423a] pb-2 pt-1 absolute left-0   whitespace-nowrap " style={{
         backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)"
       }}>
    <div ref={serviceRow1Ref} className="flex gap-8 md:gap-16 lg:gap-24 items-center">
      {[...Array(2)].map((_, groupIdx) => (
        <div key={groupIdx} className="flex gap-8 md:gap-16 lg:gap-20 items-center">
          {[
            { name: "RAILINGS", link: "#" },
            { name: "GATES", link: "#" },
            { name: "GRILLS", link: "#" },
            { name: "STAIRS", link: "#" },
            { name: "SHEDS", link: "#" },
            { name: "CANOPY", link: "#" },
          ].map((service, idx) => (
            <a
              key={idx}
              href={service.link}
              className="retro-text-item group cursor-pointer"
            >
              <span className="text-3xl md:text-7xl lg:text-8xl font-extrabold whitespace-nowrap text-transparent [-webkit-text-stroke:2px_white] group-hover:text-white group-hover:[-webkit-text-stroke:2px_white] transition-all duration-300" style={{ fontFamily: "'Arnel', sans-serif" }}>
                {service.name}
              </span>
            </a>
          ))}
        </div>
      ))}
    </div>
  </div>
          <div className="max-w-6xl mx-auto">
            {/* Main Content - Header and Slider in Flex */}
            <div className="grid md:grid-cols-2 gap-10  items-center py-50">
              {/* Services Section Header */}
              <div className="about-text ">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Our <span className="text-[#f6423a]">Services</span>
                </h2>
                <p className="text-lg text-white/80 mb-4">
                  Comprehensive metal fabrication solutions tailored to your needs. 
                  From precision cutting to custom assembly, we deliver excellence in every project.
                </p>
                <p className="text-lg text-white/80">
                  Our team combines traditional craftsmanship with modern technology to deliver 
                  superior results that exceed expectations.
                </p>
              </div>

              {/* Swiper Slider */}
        
              <div className="about-image flex justify-center">
                <Swiper
                  effect={'cards'}
                  grabCursor={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[EffectCards, Autoplay, Pagination]}
                  className="mySwiper w-full max-w-[500px]"
                  style={{ overflow: 'visible' }}
                >
                  <SwiperSlide className="rounded-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80" 
                      alt="Metal fabrication work"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="rounded-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" 
                      alt="Welding process"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="rounded-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80" 
                      alt="Metal cutting"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="rounded-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80" 
                      alt="Industrial machinery"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </SwiperSlide>
                  <SwiperSlide className="rounded-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80" 
                      alt="Metal workshop"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
{/* Services Marquee Section - Retro Style */}

        
          </div>
           <div className="flex bg-[#f6423a] pb-2 pt-1 absolute left-0 bottom-0  whitespace-nowrap " style={{
         backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)"
       }}>
    <div ref={serviceRow1Ref} className="flex gap-8 md:gap-16 lg:gap-24 items-center">
      {[...Array(2)].map((_, groupIdx) => (
        <div key={groupIdx} className="flex gap-8 md:gap-16 lg:gap-20 items-center">
          {[
            { name: "RAILINGS", link: "#" },
            { name: "GATES", link: "#" },
            { name: "GRILLS", link: "#" },
            { name: "STAIRS", link: "#" },
            { name: "SHEDS", link: "#" },
            { name: "CANOPY", link: "#" },
          ].map((service, idx) => (
            <a
              key={idx}
              href={service.link}
              className="retro-text-item group cursor-pointer"
            >
              <span className="text-3xl md:text-7xl lg:text-8xl font-extrabold whitespace-nowrap text-transparent [-webkit-text-stroke:2px_white] group-hover:text-white group-hover:[-webkit-text-stroke:2px_white] transition-all duration-300" style={{ fontFamily: "'Arnel', sans-serif" }}>
                {service.name}
              </span>
            </a>
          ))}
        </div>
      ))}
    </div>
  </div>
        </section>

        <section className="min-h-[60vh] flex items-center justify-center px-5 md:px-20 py-20 bg-gradient-to-t from-gray-900 to-[#010d3c]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Let's bring your vision to life with quality metalwork that lasts
              generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button className="px-10 py-4 bg-[#f6423a] text-white rounded-full text-lg font-semibold hover:bg-[#e03229] transition-colors">
                Get a Quote
              </button>
              <button className="px-10 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-all">
                View Portfolio
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}