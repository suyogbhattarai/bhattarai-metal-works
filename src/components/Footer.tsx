import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import Image from 'next/image'
import logo from './logo.png' // Adjust path as needed

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const services = [
    'Gates & Shutters',
    'Metal Railings',
    'Staircases',
    'Interior Metal Work',
    'Aluminum Fabrication',
    'Custom Metal Furniture'
  ]

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Get Quote', href: '/quote' }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-[var(--background)] to-[var(--navy-midnight)] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src={logo}
                alt="Bhattarai Metal Works"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Crafting excellence in metal fabrication since 2010. Your trusted partner for custom metalwork solutions across Nepal.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f6423a] flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaFacebookF className="text-white text-sm" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f6423a] flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaInstagram className="text-white text-sm" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f6423a] flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaTwitter className="text-white text-sm" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f6423a] flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaYoutube className="text-white text-sm" />
              </a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#f6423a] transition-colors text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f6423a] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#f6423a] transition-colors text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f6423a] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <FaPhoneAlt className="text-[#f6423a] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Phone</p>
                  <a href="tel:+9779841254683" className="text-white hover:text-[#f6423a] transition-colors">
                    +977 9841254683
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FaEnvelope className="text-[#f6423a] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <a href="mailto:bhattaraiworkshop@gmail.com" className="text-white hover:text-[#f6423a] transition-colors break-all">
                    bhattaraiworkshop@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-[#f6423a] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Location</p>
                  <p className="text-white">
                    Kathmandu, Nepal
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} <span className="text-[#f6423a] font-semibold">Bhattarai Metal Works</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-[#f6423a] transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-[#f6423a] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#f6423a] to-transparent"></div>
    </footer>
  )
}