'use client'

import React, { useState, useEffect } from 'react'
import {
  FiClock,
  FiTool,
  FiUpload,
  FiX,
  FiFileText,
  FiLoader
} from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import { RootState } from '@/utils/lib/redux/Store'
import { createQuotation, fetchProductDetail, clearCurrentProduct, fetchStoreServices } from '@/utils/lib/redux/features/products/productSlice'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MdCheckCircle, MdArrowForward, MdClose, MdInfoOutline } from 'react-icons/md'
import { BrandSpinner } from '@/components/BrandSpinner'
import Image from 'next/image'

export default function GetQuotePage() {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const router = useRouter()
  const productSlug = searchParams.get('product')
  const serviceId = searchParams.get('service')

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { currentProduct, currentProductLoading, services, servicesLoading } = useSelector((state: RootState) => state.products)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [quoteType, setQuoteType] = useState<'instant' | 'production'>(
    productSlug ? 'instant' : 'production'
  )
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    description: '',
    project_title: '',
    quantity: 1
  })

  // Fetch product if slug present
  useEffect(() => {
    if (productSlug) {
      dispatch(fetchProductDetail(productSlug) as any)
    }
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [productSlug, dispatch])

  // Fetch services for dropdown
  useEffect(() => {
    dispatch(fetchStoreServices() as any)
  }, [dispatch])

  // Auto-select service if service ID in URL
  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === parseInt(serviceId))
      if (service) {
        setForm(prev => ({
          ...prev,
          service: service.id.toString()
        }))
      }
    }
  }, [serviceId, services])

  // Auto-fill from auth
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prev => ({
        ...prev,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
        email: user.email,
        phone: user.phone_number || ''
      }))
    }
  }, [isAuthenticated, user])



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('quote_type', quoteType)
    formData.append('project_title', form.project_title || `Quote for ${form.service || 'Metal Work'}`)
    formData.append('description', form.description)
    formData.append('quantity', form.quantity.toString())

    // Send service ID if selected
    if (form.service) {
      formData.append('service', form.service)
    }

    if (isAuthenticated) {
      // User is logged in, backend handles linking to user profile
    } else {
      formData.append('guest_name', form.name)
      formData.append('guest_email', form.email)
      formData.append('guest_phone', form.phone)
    }

    if (currentProduct) {
      formData.append('product', currentProduct.id.toString())
    }

    // Attach files - backend expects 'upload_files'
    files.forEach(file => {
      formData.append('upload_files', file)
    })

    try {
      const resultAction = await dispatch(createQuotation(formData) as any)
      if (createQuotation.fulfilled.match(resultAction)) {
        setIsSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setError(resultAction.payload || 'Failed to submit quotation request.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-neutral-100 shadow-2xl shadow-black/5 text-center">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoCheckmarkCircle size={48} />
            </div>
            <h1 className="text-2xl font-black text-[#071236] mb-4">Request Sent!</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Our engineering team has received your {quoteType} quote request. We'll review your details and get back to you at <strong>{form.email}</strong> within 24 hours.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-[#071236] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#0a1b4d] transition-all"
              >
                Back to Portfolio
              </button>
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full bg-white text-gray-500 py-4 rounded-xl font-bold text-sm hover:text-[#071236] transition-all"
              >
                Submit another request
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="bg-neutral-50 text-neutral-900 px-6 md:px-15 py-45">
        <div className="max-w-6xl ">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#071236]">Get a Quote</h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              Tell us what you’re building. We’ll review it and get back with a clear quote.
            </p>
          </div>

          {/* Product context box */}
          {currentProduct && (
            <div className="mb-10 bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                <Image
                  src={currentProduct.primary_image || '/placeholder.png'}
                  alt={currentProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f6423a]/10 text-[#f6423a] text-xs font-bold rounded-full mb-2">
                  <MdInfoOutline />
                  Quote for product
                </div>
                <h2 className="text-xl font-bold text-[#071236]">{currentProduct.name}</h2>
                <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{currentProduct.description}</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => router.push(`/products/${currentProduct.slug}`)}
                  className="text-xs font-bold text-[#f6423a] hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          )}

          {/* Quote toggle */}
          <div className="mb-12">
            <div className="inline-flex rounded-full border border-neutral-300 bg-white p-1">
              <button
                onClick={() => setQuoteType('instant')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm ${quoteType === 'instant'
                  ? 'bg-[#f6423a] text-white'
                  : 'text-neutral-600'
                  }`}
              >
                <FiClock />
                Instant quote
              </button>

              <button
                onClick={() => setQuoteType('production')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm ${quoteType === 'production'
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
                <h2 className="font-semibold text-lg">Project details</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingInput
                    label="Project title"
                    name="project_title"
                    value={form.project_title}
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
                      {servicesLoading ? (
                        <option disabled>Loading services...</option>
                      ) : (
                        services.filter(s => s.is_active).map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <FloatingInput
                    label="Quantity / Units"
                    name="quantity"
                    type="number"
                    value={form.quantity.toString()}
                    onChange={handleChange}
                  />
                </div>
              </section>

              <section className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
                <h2 className="font-semibold text-lg">Contact details</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingInput
                    label="Full name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={isAuthenticated}
                  />

                  <FloatingInput
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    disabled={isAuthenticated}
                  />

                  <FloatingInput
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={isAuthenticated}
                  />
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
                <p className="text-xs text-neutral-500">Upload drawings, reference images, or specifications.</p>

                <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed
                                  border-neutral-300 rounded-md cursor-pointer text-sm text-neutral-600
                                  hover:border-[#f6423a] transition-colors">
                  <FiUpload />
                  Upload drawings or references
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={e =>
                      e.target.files &&
                      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
                    }
                  />
                </label>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm border border-neutral-100 p-3 rounded-lg bg-neutral-50"
                      >
                        <div className="flex items-center gap-2">
                          <FiFileText className="text-[#f6423a]" />
                          <span className="font-medium">{file.name}</span>
                          <span className="text-xs text-neutral-400">({(file.size / 1024).toFixed(1)} KB)</span>
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

              {/* Product Images if currentProduct exists */}
              {currentProduct && currentProduct.images && currentProduct.images.length > 0 && (
                <section className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                  <h2 className="font-semibold text-lg">Product Reference Images</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {currentProduct.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-100">
                        <Image
                          src={img.image}
                          alt={img.alt_text || `Reference ${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Submit */}
              <div className="flex flex-col gap-4">
                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-3">
                    <MdClose size={18} />
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#f6423a] text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#e03229] transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit request
                      <MdArrowForward size={18} />
                    </>
                  )}
                </button>
              </div>
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
  type = 'text',
  disabled = false
}: {
  label: string
  name: string
  value: string
  onChange: any
  type?: string
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        disabled={disabled}
        className="peer w-full h-12 rounded-md border border-neutral-300 bg-white px-3 text-sm
                   focus:border-[#f6423a] focus:ring-1 focus:ring-[#f6423a] outline-none disabled:bg-gray-50 disabled:text-gray-400"
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
