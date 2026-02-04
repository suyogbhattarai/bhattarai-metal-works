'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './logo.png'
import Contactbar from './Contactbar';
import { useAppSelector, useAppDispatch } from '@/utils/lib/redux/Store'
import { logout } from '@/utils/lib/redux/features/auth/authSlice'

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  variant?: 'default' | 'dashboard';
  readonly onMenuClick?: () => void;
  forceTransparent?: boolean;
}

function Navbar({ variant = 'default', onMenuClick, forceTransparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isSolidPage = pathname === '/ourbrand' || pathname?.startsWith('/ourbrand');

  const [navBg, setNavBg] = useState(forceTransparent ? 'transparent' : (isSolidPage ? 'var(--background)' : 'transparent'));
  const [textColor, setTextColor] = useState('white');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Disable GSAP for dashboard mode
    if (variant === 'dashboard') return;
    if (!navRef.current) return;

    // Homepage - use original GSAP animations
    if (isHomePage) {
      let ctx = gsap.context(() => {
        ScrollTrigger.matchMedia({
          "(min-width: 1025px)": function () {
            ScrollTrigger.create({
              trigger: 'body',
              start: '800px top',
              onEnter: () => {
                gsap.to(navRef.current, {
                  backgroundColor: 'var(--background)',
                  top: '2.2rem',
                  duration: 0.3,
                  ease: 'power2.out',
                });
              },
              onLeaveBack: () => {
                gsap.to(navRef.current, {
                  backgroundColor: 'transparent',
                  top: '3.5rem',
                  duration: 0.3,
                  ease: 'power2.out',
                  boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
                });
              }
            });
          },

          "(min-width: 768px) and (max-width: 1025px)": function () {
            ScrollTrigger.create({
              trigger: 'body',
              start: '600px top',
              onEnter: () => {
                gsap.to(navRef.current, {
                  backgroundColor: 'var(--background)',
                  top: '0rem',
                  duration: 0.3,
                  ease: 'power2.out',
                  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.25)'
                });
              },
              onLeaveBack: () => {
                gsap.to(navRef.current, {
                  backgroundColor: 'transparent',
                  top: '1.2rem',
                  duration: 0.3,
                  ease: 'power2.out',
                  boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
                });
              }
            });
          },

          "(max-width: 767px)": function () {
            ScrollTrigger.create({
              trigger: 'body',
              start: '400px top',
              onEnter: () => {
                gsap.to(navRef.current, {
                  backgroundColor: 'var(--background)',
                  top: '0rem',
                  duration: 0.3,
                  ease: 'power2.out',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                });
              },
              onLeaveBack: () => {
                gsap.to(navRef.current, {
                  backgroundColor: 'transparent',
                  top: '0.5rem',
                  duration: 0.3,
                  ease: 'power2.out',
                  boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
                });
              }
            });
          }
        });
      });

      return () => ctx.revert();
    }

    // Other pages - adaptive navbar based on scroll and background
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = document.querySelectorAll('section');

      // Check which section is currently at the top
      let currentBg = 'transparent';
      let currentText = 'white';
      let foundSection = false;

      // 1. Detect section background for text color switching
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          foundSection = true;
          const bgColor = window.getComputedStyle(section).backgroundColor;
          if (bgColor.includes('rgb')) {
            const rgb = bgColor.match(/\d+/g);
            if (rgb) {
              const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
              // If it's a light section, we could switch to dark text here if needed
              // Text is white globally for now based on design
            }
          }
        }
      });

      // 2. Set background based on scroll threshold
      if (scrollY >= 80) {
        currentBg = 'var(--background)';
      } else {
        currentBg = 'transparent';
      }

      // 3. Special overrides for specific pages
      if (pathname === '/about' || pathname?.startsWith('/about') ||
        pathname === '/services' || pathname?.startsWith('/services')) {
        currentBg = 'transparent';
      }

      if (isSolidPage) {
        currentBg = 'var(--background)';
      }

      setNavBg(currentBg);
      setTextColor(currentText);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant, isHomePage]);

  const getNavStyles = () => {
    if (variant === 'dashboard') {
      return "fixed top-0 bg-[var(--background)] border-b border-white/10 h-16 py-10 flex items-center";
    }
    if (isHomePage) {
      return "fixed lg:top-15 md:top-5 top-1";
    }
    // Other pages - dynamic positioning: lower when transparent, higher when background active
    return navBg === 'transparent' ? "fixed top-2 md:top-12 lg:top-14" : "fixed top-1 md:top-9";
  };

  const getNavPadding = () => {
    return "";
  };

  const isAdmin = user?.role === 'admin' || user?.is_admin;
  const isStaff = user?.role === 'staff' || user?.is_staff;

  return (
    <>
      {variant !== 'dashboard' && <div className="hidden lg:block"><Contactbar /></div>}
      <nav
        ref={navRef}
        style={{ backgroundColor: navBg }}
        className={`${getNavStyles()} left-0 right-0 w-full z-40 transition-all duration-500 ${navBg === 'transparent' ? '' : 'backdrop-blur-md shadow-sm'}`}
      >
        <div className={`w-full max-w-[1920px] mx-auto ${variant === 'dashboard' ? 'px-4 lg:px-6' : `lg:px-15 ${navBg === 'transparent' ? 'md:py-[1.3rem] py-[0.8rem]' : 'md:py-[2rem] py-[1.2rem]'} md:px-10 sm:px-5 px-5`}`}>
          <div className="rounded-lg ">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-shrink-0">
                <div className="w-[160px] sm:w-[200px] md:w-[200px] lg:w-[250px]">
                  <a href="/"><Image src={logo} alt="Logo" className="object-contain w-full" /></a>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                <a href="/services" style={{ color: textColor }} className="hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Services</a>
                <a href="/products" style={{ color: textColor }} className="hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Products</a>
                <a href="/portfolio" style={{ color: textColor }} className="hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">Portfolio</a>
                <a href="/about" style={{ color: textColor }} className="hover:text-[#f6423a] transition text-sm xl:text-base whitespace-nowrap">About Us</a>



                <div className="flex items-center gap-3">
                  {!mounted ? (
                    <div className="w-24 h-9 rounded-full bg-white/5 animate-pulse"></div>
                  ) : isAuthenticated ? (
                    <div className="flex items-center gap-4">
                      {(isAdmin || isStaff) && (
                        <a href="/dashboard" className="border border-[#f6423a] px-4 xl:px-6 py-2 rounded-full font-semibold text-white hover:text-[#f6423a] hover:bg-[#f6423a]/10 transition text-sm xl:text-base">
                          Dashboard
                        </a>
                      )}
                      <div className="relative" ref={profileDropdownRef}>
                        <button
                          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                          className="flex items-center gap-2 hover:opacity-80 transition"
                        >
                          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                            {user?.profile_picture ? (
                              <Image
                                src={user.profile_picture}
                                alt={user.username}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#f6423a] text-white font-bold text-sm">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <svg className={`w-4 h-4 text-white transition ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </button>

                        {isProfileDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-[var(--background)] rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-700">
                              <p className="font-semibold text-white">{user?.username}</p>
                              <p className="text-sm text-gray-400">{user?.email}</p>
                              {(isAdmin || isStaff) && (
                                <p className="text-xs text-[#f6423a] mt-1 capitalize">{user?.role}</p>
                              )}
                            </div>
                            <a
                              href="/profile"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="block px-4 py-2 text-white hover:bg-gray-700 transition"
                            >
                              My Profile
                            </a>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition text-red-400 hover:text-red-300"
                            >
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : loading ? (
                    <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse border border-white/5"></div>
                  ) : (
                    <a href="/login" className="border border-white px-4 xl:px-6 py-2 rounded-full font-semibold text-white hover:text-white hover:border-white hover:bg-white/20 transition text-base" onClick={() => setIsOpen(false)}>Login</a>
                  )}
                  <a href="/getquote" className={`${(pathname?.startsWith('/products') && navBg === 'transparent') ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#f6423a] text-white hover:bg-[#e03229]'} px-4 xl:px-6 py-2 rounded-full font-semibold transition text-sm xl:text-base whitespace-nowrap`}>
                    Contact Us
                  </a>
                </div>

              </div>

              <button
                onClick={() => variant === 'dashboard' ? onMenuClick?.() : setIsOpen(!isOpen)}
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
              className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="flex flex-col items-center gap-3 py-4">
                <a href="/services" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Services</a>
                <a href="/products" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Products</a>
                <a href="/portfolio" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Portfolio</a>
                <a href="/about" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>About Us</a>



                {!mounted ? (
                  <div className="w-32 h-6 bg-white/5 animate-pulse rounded-full my-2"></div>
                ) : isAuthenticated ? (
                  <>
                    {(isAdmin || isStaff) && (
                      <a href="/dashboard" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </a>
                    )}
                    <a href="/profile" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>
                      My Profile
                    </a>
                    <button onClick={() => { handleLogout(); }} className="text-white hover:text-[#f6423a] transition text-base">
                      Logout
                    </button>
                  </>
                ) : loading ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse border border-white/5 my-2"></div>
                ) : (
                  <a href="/login" className="text-white hover:text-[#f6423a] transition text-base" onClick={() => setIsOpen(false)}>Login</a>
                )}

                <a href="/getquote" className="bg-[#f6423a] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#e03229] transition text-base mt-2" onClick={() => setIsOpen(false)}>

                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar