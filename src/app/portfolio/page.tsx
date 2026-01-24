'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

/* ---------------- DATA ---------------- */

const portfolioItems = [
  {
    title: 'Modern Steel Gate',
    category: 'Gates & Shutters',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Industrial Steel Table',
    category: 'Tables',
    img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Stainless Steel Railing',
    category: 'Railing',
    img: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Floating Metal Staircase',
    category: 'Staircase',
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Ornate Driveway Gate',
    category: 'Gates & Shutters',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Black Console Table',
    category: 'Tables',
    img: 'https://images.unsplash.com/photo-1579653529423-3d632e09e0e0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Glass Panel Railing',
    category: 'Railing',
    img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Decorative Metal Divider',
    category: 'Interior',
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Aluminum Sliding Shutter',
    category: 'Aluminum',
    img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Spiral Metal Staircase',
    category: 'Staircase',
    img: 'https://images.unsplash.com/photo-1598300053654-1a07b79c37d6?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Metal Room Divider',
    category: 'Interior',
    img: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Aluminum Window Frame',
    category: 'Aluminum',
    img: 'https://images.unsplash.com/photo-1577457629428-7da63b3b4a8f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Modern Sliding Gate',
    category: 'Gates & Shutters',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Steel Dining Table',
    category: 'Tables',
    img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Balcony Railing',
    category: 'Railing',
    img: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Curved Staircase',
    category: 'Staircase',
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
  },
]

const categories = ['All', 'Gates & Shutters', 'Railing', 'Staircase', 'Interior', 'Aluminum']

// Map URL parameters to category names
const categoryMap: { [key: string]: string } = {
  'gatesandshutter': 'Gates & Shutters',
  'railing': 'Railing',
  'staircase': 'Staircase',
  'interior': 'Interior',
  'aluminum': 'Aluminum',
}

/* ---------------- COMPONENT ---------------- */

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  
  // Get the activeTab from URL or default to 'All'
  const getInitialFilter = () => {
    const activeTab = searchParams.get('activeTab')
    if (activeTab && categoryMap[activeTab.toLowerCase()]) {
      return categoryMap[activeTab.toLowerCase()]
    }
    return 'All'
  }

  const [activeFilter, setActiveFilter] = useState(getInitialFilter())

  // Update filter when URL changes
  useEffect(() => {
    setActiveFilter(getInitialFilter())
  }, [searchParams])

  const filteredItems =
    activeFilter === 'All'
      ? portfolioItems
      : portfolioItems.filter(item => item.category === activeFilter)

  /* ---------------- GSAP ---------------- */

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.bento-card')

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      }
    )
  }, [filteredItems])

  /* ---------------- BENTO LAYOUT LOGIC ---------------- */
  
  const getSizeClasses = (index: number) => {
    const position = index % 4
    
    switch(position) {
      case 0:
        return 'md:col-span-2 md:row-span-2'
      case 1:
        return 'md:col-span-1 md:row-span-1'
      case 2:
        return 'md:col-span-1 md:row-span-1'
      case 3:
        return 'md:col-span-2 md:row-span-1'
      default:
        return 'md:col-span-1 md:row-span-1'
    }
  }

  return (
    <>
    <Navbar/>
       <section
      ref={containerRef}
      className="min-h-screen px-6 md:px-14 py-35 md:py-40 text-white bg-white"
    >
      {/* HEADER + FILTERS */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === category
                  ? 'bg-[#f6423a] text-white shadow-lg shadow-red-500/30'
                  : 'bg-[#071236] text-white hover:bg-neutral-700 border border-neutral-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] gap-4">
        {filteredItems.map((item, index) => (
          <div
            key={item.title + index}
            className={`bento-card relative overflow-hidden rounded-xl bg-neutral-900 shadow-lg group cursor-pointer transition-transform hover:scale-[1.02] ${getSizeClasses(
              index
            )}`}
          >
            <img
              src={item.img}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 h-full flex items-end p-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#f6423a] font-semibold">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold leading-tight mt-1 text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Footer/>
    </>
  )
}