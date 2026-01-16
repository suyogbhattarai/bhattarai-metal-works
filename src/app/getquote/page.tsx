'use client'

import React, { useState } from 'react'
import {
  FiClock,
  FiTool,
  FiUpload,
  FiX,
  FiFileText
} from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function GetQuotePage() {
  const [quoteType, setQuoteType] = useState<'instant' | 'production'>('instant')
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    description: ''
  })

  const services = [
    'Gates & Shutters',
    'Metal Railings',
    'Staircases',
    'Interior Works',
    'Aluminum Works',
    'Custom Fabrication'
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Navbar />

      <main className="bg-neutral-50 text-neutral-900 px-6 md:px-15 py-45">
        <div className="max-w-6xl ">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold">Get a quote</h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              Tell us what you’re building. We’ll review it and get back with a clear quote.
            </p>
          </div>

          {/* Quote toggle */}
          <div className="mb-12">
            <div className="inline-flex rounded-full border border-neutral-300 bg-white p-1">
              <button
                onClick={() => setQuoteType('instant')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm ${
                  quoteType === 'instant'
                    ? 'bg-[#f6423a] text-white'
                    : 'text-neutral-600'
                }`}
              >
                <FiClock />
                Instant quote
              </button>

              <button
                onClick={() => setQuoteType('production')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm ${
                  quoteType === 'production'
                    ? 'bg-[#f6423a] text-white'
                    : 'text-neutral-600'
                }`}
              >
                <FiTool />
                Production quote
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="grid lg:grid-cols-12 gap-10">

            {/* Form */}
            <div className="lg:col-span-8 space-y-8">

              {/* Contact */}
              <section className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
                <h2 className="font-semibold text-lg">Contact details</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingInput
                    label="Full name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                  />

                  <FloatingInput
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-xs mb-1 text-neutral-600">
                      Service
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full h-12 rounded-md border border-neutral-300 bg-white px-3 text-sm
                                 focus:border-[#f6423a] focus:ring-1 focus:ring-[#f6423a] outline-none"
                    >
                      <option value="">Select a service</option>
                      {services.map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Description */}
              <section className="bg-white border border-neutral-200 rounded-xl p-6 space-y-3">
                <h2 className="font-semibold text-lg">Project overview</h2>
                <textarea
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Dimensions, materials, drawings, references…"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:border-[#f6423a] focus:ring-1 focus:ring-[#f6423a] outline-none"
                />
              </section>

              {/* Files */}
              <section className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                <h2 className="font-semibold text-lg">Attachments</h2>

                <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed
                                  border-neutral-300 rounded-md cursor-pointer text-sm text-neutral-600
                                  hover:border-[#f6423a]">
                  <FiUpload />
                  Upload drawings or references
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={e =>
                      e.target.files &&
                      setFiles(prev => [...prev, ...Array.from(e.target.files)])
                    }
                  />
                </label>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm border-b py-2"
                      >
                        <div className="flex items-center gap-2">
                          <FiFileText className="text-[#f6423a]" />
                          {file.name}
                        </div>
                        <FiX
                          className="cursor-pointer text-neutral-500 hover:text-red-500"
                          onClick={() =>
                            setFiles(prev => prev.filter((_, idx) => idx !== i))
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Submit */}
              <button className="bg-[#f6423a] text-white px-8 py-3 rounded-md text-sm font-medium hover:opacity-90">
                Submit request
              </button>
            </div>

            {/* Aside */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 bg-white border border-neutral-200 rounded-xl p-6 space-y-4 text-sm">
                <AsideItem text="Reviewed by a real engineer" />
                <AsideItem text="Clear pricing, no surprises" />
                <AsideItem text="Reply within 24 hours" />
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

/* ---------- Components ---------- */

function FloatingInput({
  label,
  name,
  value,
  onChange,
  type = 'text'
}: {
  label: string
  name: string
  value: string
  onChange: any
  type?: string
}) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full h-12 rounded-md border border-neutral-300 bg-white px-3 text-sm
                   focus:border-[#f6423a] focus:ring-1 focus:ring-[#f6423a] outline-none"
      />
      <label
        className="absolute left-3 top-3 text-sm text-neutral-500 bg-white px-1
                   transition-all
                   peer-placeholder-shown:top-3
                   peer-focus:-top-2
                   peer-focus:text-xs
                   peer-focus:text-[#f6423a]"
      >
        {label}
      </label>
    </div>
  )
}

function AsideItem({ text }: { text: string }) {
  return (
    <div className="flex gap-2 items-start">
      <IoCheckmarkCircle className="text-[#f6423a] mt-0.5" />
      <span>{text}</span>
    </div>
  )
}
