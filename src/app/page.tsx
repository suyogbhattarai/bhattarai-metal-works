'use client';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { GiMetalBar, GiChemicalDrop } from "react-icons/gi";
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
import Image from 'next/image'
import logo from './logo.png'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';

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
  const whyChooseSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
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

      // Parallax card overlap effect for Why Choose Us section
      if (whyChooseSectionRef.current) {
        gsap.fromTo(
          whyChooseSectionRef.current,
          {
            y: '100vh',
            scale: 0.9,
            opacity: 0
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: whyChooseSectionRef.current,
              start: 'top bottom',
              end: 'top 20%',
              scrub: 1.5,
              anticipatePin: 1,
            },
          }
        );
      }

      // Scroll animations for sections
      sectionsRef.current.forEach((section) => {
        if (!section) return;
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

      const TEXT_START = 0.1;

      // Only set up scroll trigger if video container exists
      if (videoContainerRef.current && videoRef.current) {
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

          // TABLET (md to lg - 768px to 1024px)
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
              height: "43vh",
              width: "97vw",
              y: "12vh",
              x: "1.2vw",
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
              y: "-65%",
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
      }
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
      <Navbar />
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
              <a href="/portfolio"><button className="py-3 px-8 bg-[#f6423a] hover:bg-[#e03229] text-white rounded-full transition w-full text-sm md:text-base">
                Explore Our Work
              </button></a>
              <a href="/getquote">
                <button className="px-8 py-3 w-full border border-white text-white rounded-full hover:bg-white/10 transition text-sm md:text-base">
                  Contact Us
                </button></a>

            </div>
          </div>
        </div>

        <div className="new-content mb-10  lg:px-15 md:px-10 sm:px-5 px-3 absolute lg:top-[31%] md:top-[56.7%] sm:top-[57%] top-[46%] hidden  w-full lg:w-[54%] md:w-[90%]">
          <div className="mb-6">
            <h1 className="text-[1.4rem] sm:text-[2rem] md:text-[32px] lg:text-[2.2rem] font-bold leading-relaxed">
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
            <a href="/getquote">
              <button className="py-3 w-full px-6 md:px-4 bg-[#f6423a] hover:bg-[#e03229] text-white rounded-full text-sm md:text-base font-semibold transition">
                Instant Quote
              </button>
            </a>
            <a href="/getquote">
              <button className="px-6 w-full md:px-4 py-3 bg-[#f6423a] hover:bg-[#e03229] text-white rounded-full text-sm md:text-base font-semibold transition">
                Production Quote
              </button>
            </a>

          </div>

 
        </div>
      </section>

      <main className="bg-gradient-to-b from-[#030447] to-gray-900 text-white">

        <div ref={whyChooseSectionRef} className="relative z-20">
          <WhyChooseSection />
        </div>
        
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


        <section className=" flex items-center justify-center px-5 md:px-20 py-10 w-[100%] mx-auto bg-gradient-to-t from-[#000c3a] to-[#00082a] rounded-t-[50px] shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1),_0px_-2px_4px_-2px_rgba(0,0,0,0.06)]">
          <div className="max-w-4xl relative py-10  mx-auto text-center">

            <h2 className="text-5xl  md:text-7xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Let's bring your vision to life with quality metalwork that lasts
              generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a href="/getquote">  <button className="px-10 py-4 bg-[#f6423a] text-white rounded-full text-lg font-semibold hover:bg-[#e03229] transition-colors">
                Get a Quote
              </button></a>

              <a href="/portfolio">  <button className="px-10 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-all">
                View Portfolio
              </button></a>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}