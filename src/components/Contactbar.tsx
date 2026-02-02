import React from 'react'
import Link from 'next/link'
import { FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

function Contactbar() {
  return (
    <div className="">
      <div className="w-full fixed top-0 left-0 bg-white/20 backdrop-blur-sm text-white py-2  z-50">     
       <div className="flex justify-between lg:px-15 md:px-10 sm:px-5 px-3 items-center">
        {/* Contact Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaPhone className="text-white" />
            <span className="text-sm">+977 9841254683</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-white" />
            <span className="text-sm">bhattaraiworkshop@gmail.com</span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-[#d96a4a] transition-colors">
            <FaFacebookF />
          </Link>
          <Link href="#" className="hover:text-[#d96a4a] transition-colors">
            <FaTwitter />
          </Link>
          <Link href="#" className="hover:text-[#d96a4a] transition-colors">
            <FaInstagram />
          </Link>
          <Link href="#" className="hover:text-[#d96a4a] transition-colors">
            <FaYoutube />
          </Link>
        </div>
      </div>
    </div>
    </div>

  )
}

export default Contactbar