'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './logo.png'
import Contactbar from './Contactbar';

gsap.registerPlugin(ScrollTrigger);

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    ScrollTrigger.matchMedia({
      // DESKTOP (lg and above - 1024px+)
      "(min-width: 1024px)": function() {
        ScrollTrigger.create({
          trigger: 'body',
          start: '800px top',
          onEnter: () => {
            gsap.to(navRef.current, {
              backgroundColor: '#010d3c',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              top: '2.2rem',
              duration: 0.3,
              ease: 'power2.out',
             
            });
          },
          onLeaveBack: () => {
            gsap.to(navRef.current, {
              backgroundColor: 'transparent',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              top: '3.5rem',
              duration: 0.3,
              ease: 'power2.out',
              boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
            });
          }
        });
      },

      // TABLET (md to lg - 768px to 1023px)
      "(min-width: 768px) and (max-width: 1023px)": function() {
        ScrollTrigger.create({
          trigger: 'body',
          start: '600px top',
          onEnter: () => {
            gsap.to(navRef.current, {
              backgroundColor: '#010d3c',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              top: '1rem',
              duration: 0.3,
              ease: 'power2.out',
              boxShadow: '0 3px 5px rgba(0, 0, 0, 0.25)'
            });
          },
          onLeaveBack: () => {
            gsap.to(navRef.current, {
              backgroundColor: 'transparent',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              top: '2.5rem',
              duration: 0.3,
              ease: 'power2.out',
              boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
            });
          }
        });
      },

      // MOBILE (below md - under 768px)
      "(max-width: 767px)": function() {
        ScrollTrigger.create({
          trigger: 'body',
          start: '400px top',
          onEnter: () => {
            gsap.to(navRef.current, {
              backgroundColor: '#010d3c',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              top: '0rem',
              duration: 0.3,
              ease: 'power2.out',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            });
          },
          onLeaveBack: () => {
            gsap.to(navRef.current, {
              backgroundColor: 'transparent',
              paddingTop: '0rem',
              paddingBottom: '0rem',
              top: '0.5rem',
              duration: 0.3,
              ease: 'power2.out',
              boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
            });
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="hidden lg:block"><Contactbar /></div>
      <nav ref={navRef} className="fixed lg:top-14 md:top-10 lg:px-15 md:px-10 sm:px-5 px-3 top-2 left-0 right-0 w-full z-50 transition-all duration-300">
        <div className="rounded-lg py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-shrink-0">
              <div className="w-[120px] sm:w-[150px] md:w-[200px] lg:w-[250px]">
                <Image src={logo} alt="Logo" className="object-contain w-full" />
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <a href="#" className="text-white hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Lorem</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Ipsum</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Dummys</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Simple Text</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Ipsums</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Has Been</a>
              <a href="#" className="bg-[#f6423a] text-white px-4 xl:px-6 py-2 rounded-full font-semibold hover:bg-[#e03229] transition text-sm xl:text-base whitespace-nowrap">
                Lorem H
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col items-center gap-3 py-4">
              <a href="#" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Lorem</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Ipsum</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Dummys</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Simple Text</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Ipsums</a>
              <a href="#" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Has Been</a>
              <a href="#" className="bg-[#f6423a] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#e03229] transition text-base mt-2" onClick={() => setIsOpen(false)}>
                Lorem H
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar