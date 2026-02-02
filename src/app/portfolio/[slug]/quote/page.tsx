'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/utils/lib/redux/Store'
import { fetchProductDetail, createQuotation } from '@/utils/lib/redux/features/products/productSlice'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getApiImageUrl } from '@/utils/imageUrl'
import {
    MdArrowForward,
    MdCheckCircle,
    MdOutlineSquareFoot,
    MdOutlineFormatPaint,
    MdClose,
    MdNavigateBefore
} from 'react-icons/md'
import { FiLoader, FiCheck } from 'react-icons/fi'
import { IoCheckmarkCircle } from 'react-icons/io5'
import Link from 'next/link'

export default function ProductQuotePage() {
    const { slug } = useParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const { currentProduct, currentProductLoading } = useSelector((state: RootState) => state.products)
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [dimensions, setDimensions] = useState({
        height: '',
        width: '',
        depth: ''
    })
    const [selectedMaterials, setSelectedMaterials] = useState<number[]>([])
    const [quantity, setQuantity] = useState(1)
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (slug) {
            dispatch(fetchProductDetail(slug as string) as any)
        }
    }, [slug, dispatch])

    useEffect(() => {
        if (currentProduct) {
            setDimensions({
                height: currentProduct.height?.toString() || '',
                width: currentProduct.width?.toString() || '',
                depth: currentProduct.length?.toString() || ''
            })
            // Default select first material if available
            if (currentProduct.materials && currentProduct.materials.length > 0) {
                // setSelectedMaterials([currentProduct.materials[0].id])
            }
        }
    }, [currentProduct])

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/portfolio/${slug}/quote`)
        }
    }, [isAuthenticated, router, slug])

    const handleMaterialToggle = (id: number) => {
        setSelectedMaterials(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentProduct) return

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData()
        formData.append('quote_type', 'production')
        formData.append('project_title', `Custom Quote for ${currentProduct.name}`)
        formData.append('product', currentProduct.id.toString())
        formData.append('quantity', quantity.toString())

        const materialNames = currentProduct.materials
            ?.filter(m => selectedMaterials.includes(m.id))
            .map(m => m.name)
            .join(', ')

        const description = `
            Product: ${currentProduct.name}
            Dimensions: H:${dimensions.height}cm x W:${dimensions.width}cm x D:${dimensions.depth}cm
            Selected Materials: ${materialNames || 'Standard'}
            Additional Notes: ${notes}
        `.trim()

        formData.append('description', description)
        formData.append('service_type', 'Custom Fabrication')

        try {
            const resultAction = await dispatch(createQuotation(formData) as any)
            if (createQuotation.fulfilled.match(resultAction)) {
                setIsSuccess(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setError(resultAction.payload || 'Failed to submit quote.')
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
                <main className="min-h-screen bg-[#f4f6f8] pt-40 px-6 flex items-center justify-center">
                    <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/5 text-center">
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <IoCheckmarkCircle size={56} />
                        </div>
                        <h1 className="text-3xl font-black text-[#071236] mb-4 tracking-tight">Quote Requested!</h1>
                        <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
                            We've received your custom specification for <span className="font-bold text-[#f6423a]">{currentProduct?.name}</span>. Our engineers will review your measurements and get back to you within 24 hours.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/portfolio')}
                                className="w-full bg-[#071236] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#0a1b4d] transition-all shadow-xl shadow-black/10 active:scale-95"
                            >
                                Back to Portfolio
                            </button>
                            <Link
                                href="/profile"
                                className="block w-full text-gray-400 py-3 font-bold text-xs hover:text-[#071236] transition-all"
                            >
                                View My Requests
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    if (!isAuthenticated) return null // Handled by useEffect redirect

    return (
        <div className="bg-[#f4f6f8] min-h-screen">
            <Navbar />

            <main className="w-full max-w-[1920px] mx-auto lg:px-15 md:px-10 px-5 pt-32 md:pt-40 pb-20">
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => router.back()}
                        className="p-3 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-[#f6423a] hover:border-[#f6423a]/20 transition-all shadow-sm"
                    >
                        <MdNavigateBefore size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#071236] tracking-tight">Configure Your Project</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {currentProduct?.name} — Custom Quote
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Configuration Form */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Dimensions */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-black/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500">
                                    <MdOutlineSquareFoot size={24} />
                                </div>
                                <h2 className="text-lg font-black text-[#071236]">Custom Dimensions (cm)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <DimensionInput
                                    label="Height"
                                    value={dimensions.height}
                                    onChange={(val) => setDimensions({ ...dimensions, height: val })}
                                />
                                <DimensionInput
                                    label="Width"
                                    value={dimensions.width}
                                    onChange={(val) => setDimensions({ ...dimensions, width: val })}
                                />
                                <DimensionInput
                                    label="Depth / Length"
                                    value={dimensions.depth}
                                    onChange={(val) => setDimensions({ ...dimensions, depth: val })}
                                />
                            </div>
                            <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                * All measurements are in centimeters (cm).
                            </p>
                        </section>

                        {/* 2. Materials */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-black/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500">
                                    <MdOutlineFormatPaint size={24} />
                                </div>
                                <h2 className="text-lg font-black text-[#071236]">Material Selection</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentProduct?.materials?.map((mat) => (
                                    <button
                                        key={mat.id}
                                        onClick={() => handleMaterialToggle(mat.id)}
                                        className={`flex items-start gap-4 p-4 rounded-3xl border-2 transition-all text-left ${selectedMaterials.includes(mat.id) ? 'border-[#f6423a] bg-red-50/30' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
                                    >
                                        <div className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${selectedMaterials.includes(mat.id) ? 'bg-[#f6423a] border-[#f6423a] text-white' : 'border-gray-300 bg-white'}`}>
                                            {selectedMaterials.includes(mat.id) && <FiCheck size={14} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#071236] text-sm">{mat.name}</p>
                                            <p className="text-[10px] text-gray-500 leading-relaxed mt-1">{mat.description || 'Premium industrial grade.'}</p>
                                        </div>
                                    </button>
                                ))}
                                {(!currentProduct?.materials || currentProduct.materials.length === 0) && (
                                    <p className="text-xs text-gray-400 font-medium italic">Standard factory materials will be used.</p>
                                )}
                            </div>
                        </section>

                        {/* 3. Additional Requirements */}
                        <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-black/5">
                            <h2 className="text-lg font-black text-[#071236] mb-6">Additional Instructions</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific requirements, color preferences, or site conditions..."
                                rows={6}
                                className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-sm focus:border-[#f6423a] focus:ring-1 focus:ring-[#f6423a]/20 outline-none transition-all placeholder:text-gray-300 font-medium"
                            />
                        </section>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-40 space-y-6">
                            <div className="bg-[#071236] text-white rounded-[2.5rem] p-8 shadow-2xl shadow-[#071236]/30 overflow-hidden relative">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black mb-6">Quote Summary</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                            <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Base Product</span>
                                            <span className="font-bold text-sm truncate max-w-[150px]">{currentProduct?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                            <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Quantity</span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/50 hover:text-white">-</button>
                                                <span className="font-bold text-sm">{quantity}</span>
                                                <button onClick={() => setQuantity(quantity + 1)} className="text-white/50 hover:text-white">+</button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Pricing Model</span>
                                            <span className="font-bold text-sm text-[#f6423a]">Custom Estimate</span>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/20 text-red-200 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest mb-6 border border-red-500/30">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || currentProductLoading}
                                        className="w-full bg-[#f6423a] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#f6423a]/20 hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" size={18} /> : (
                                            <>Place Order Request <MdArrowForward size={18} /></>
                                        )}
                                    </button>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f6423a] blur-[100px] opacity-20 -mr-16 -mt-16" />
                            </div>

                            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 flex items-center gap-4 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                                    <img src={getApiImageUrl(currentProduct?.primary_image) || ''} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Previewing</p>
                                    <p className="text-sm font-black text-[#071236] truncate">{currentProduct?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function DimensionInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0.00"
                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-[#071236] focus:border-[#f6423a] focus:ring-1 focus:ring-[#f6423a]/20 outline-none transition-all"
            />
        </div>
    )
}
