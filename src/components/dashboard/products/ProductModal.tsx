import React, { useState, useEffect } from 'react';
import { MdClose, MdCloudUpload, MdDelete, MdCheck, MdInfo, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchMaterials } from '@/utils/lib/redux/features/products/productSlice';
import { ButtonLoading } from '@/components/Loading';
import { getApiImageUrl } from '@/utils/imageUrl';

interface ProductModalProps {
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    product?: any;
    categories: any[];
    submitting: boolean;
}

export default function ProductModal({ onClose, onSubmit, product, categories, submitting }: ProductModalProps) {
    const dispatch = useDispatch();
    const { materials } = useSelector((state: RootState) => state.products);
    const [activeTab, setActiveTab] = useState('basic');

    // Form States
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        category: '',
        base_price: '',
        description: '',
        product_type: 'Physical', // Default
        is_price_visible: true,
        stock_quantity: '',
        low_stock_threshold: '5',
        is_featured: false,
        is_active: true, // Default true as per user request for "manual activation" context ? Usually direct publish.
        is_customizable: false,
        customization_note: ''
    });

    const [dimensions, setDimensions] = useState({
        length: '',
        width: '',
        height: '',
        weight: ''
    });

    const [seo, setSeo] = useState({
        meta_description: '',
        meta_keywords: ''
    });

    const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);

    // Images: Array of file objects or existing image URLs
    const [newImages, setNewImages] = useState<{ file: File, altText: string, preview: string, isPrimary: boolean }[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);

    useEffect(() => {
        dispatch(fetchMaterials() as any);

        if (product) {
            // Populate form for editing
            setBasicInfo({
                name: product.name || '',
                category: typeof product.category === 'object' ? product.category?.id?.toString() || '' : product.category?.toString() || '',
                base_price: product.base_price?.toString() || '',
                description: product.description || '',
                product_type: product.product_type || 'Physical',
                is_price_visible: product.is_price_visible ?? true,
                stock_quantity: product.stock_quantity?.toString() || '0',
                low_stock_threshold: product.low_stock_threshold?.toString() || '5',
                is_featured: product.is_featured ?? false,
                is_active: product.is_active ?? true,
                is_customizable: product.is_customizable ?? false,
                customization_note: product.customization_note || ''
            });

            setDimensions({
                length: product.length?.toString() || '',
                width: product.width?.toString() || '',
                height: product.height?.toString() || '',
                weight: product.weight?.toString() || ''
            });

            setSeo({
                meta_description: product.meta_description || '',
                meta_keywords: product.meta_keywords || ''
            });

            if (product.materials) {
                const matIds = product.materials.map((m: any) => typeof m === 'object' ? m.id : m);
                setSelectedMaterials(matIds);
            }

            if (product.images) {
                setExistingImages(product.images);
            }
        }
    }, [product, dispatch]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImgObjs = files.map(file => ({
                file,
                altText: '',
                preview: URL.createObjectURL(file),
                isPrimary: newImages.length === 0 && existingImages.length === 0 // Make first image primary if none exist
            }));
            setNewImages([...newImages, ...newImgObjs]);
        }
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const handleSetPrimaryNew = (index: number) => {
        const updatedExisting = existingImages.map(img => ({ ...img, is_primary: false }));
        setExistingImages(updatedExisting);
        const updatedNew = newImages.map((img, i) => ({ ...img, isPrimary: i === index }));
        setNewImages(updatedNew);
    };

    const handleSetPrimaryExisting = (id: number) => {
        const updatedNew = newImages.map(img => ({ ...img, isPrimary: false }));
        setNewImages(updatedNew);
        const updatedExisting = existingImages.map(img => ({ ...img, is_primary: img.id === id }));
        setExistingImages(updatedExisting);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // Helper to append only present values
        const appendSafe = (key: string, value: any) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value.toString());
            }
        };

        // Basic Info
        Object.entries(basicInfo).forEach(([key, value]) => appendSafe(key, value));

        // Dimensions
        Object.entries(dimensions).forEach(([key, value]) => appendSafe(key, value));

        // SEO
        Object.entries(seo).forEach(([key, value]) => appendSafe(key, value));

        // Materials
        selectedMaterials.forEach(id => formData.append('materials', id.toString()));

        // Images
        newImages.forEach((img, index) => {
            formData.append('images', img.file);
            formData.append('alt_texts', img.altText || 'Product Image');
        });

        // Calculate primary image index for NEW images
        const primaryIndex = newImages.findIndex(img => img.isPrimary);
        if (primaryIndex !== -1) {
            formData.append('primary_image_index', primaryIndex.toString());
        }

        await onSubmit(formData);
    };

    const tabs = [
        { id: 'basic', label: 'Basic' },
        { id: 'materials', label: 'Materials' },
        { id: 'images', label: 'Media' },
        { id: 'details', label: 'Details' }, // Dimensions & SEO
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-0 md:p-4">
            <div className="bg-[#111e48] md:rounded-2xl w-full max-w-5xl h-full md:h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slideUp">

                {/* Header */}
                <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-[#0a1642] shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Fill in the details below</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Mobile Tabs (Horizontal Scroll) */}
                <div className="flex border-b border-white/10 bg-[#0c1a45] overflow-x-auto shrink-0 no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-white bg-white/5'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f6423a]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#0e1736]">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">

                        {/* BASIC DETAILS */}
                        {activeTab === 'basic' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <FormSection title="General Information">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Product Name *" value={basicInfo.name} onChange={v => setBasicInfo({ ...basicInfo, name: v })} required />
                                            <SelectGroup
                                                label="Category *"
                                                value={basicInfo.category}
                                                onChange={v => setBasicInfo({ ...basicInfo, category: v })}
                                                options={categories.map(c => ({ value: c.id, label: c.name }))}
                                                required
                                            />
                                            <InputGroup label="Base Price ($) *" type="number" value={basicInfo.base_price} onChange={v => setBasicInfo({ ...basicInfo, base_price: v })} required />

                                            <div className="flex gap-4 items-center">
                                                <div className="flex-1">
                                                    <InputGroup label="Stock Quantity" type="number" value={basicInfo.stock_quantity} onChange={v => setBasicInfo({ ...basicInfo, stock_quantity: v })} />
                                                </div>
                                                <div className="flex-1">
                                                    <InputGroup label="Low Stock Alert" type="number" value={basicInfo.low_stock_threshold} onChange={v => setBasicInfo({ ...basicInfo, low_stock_threshold: v })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Description</label>
                                            <textarea
                                                rows={5}
                                                value={basicInfo.description}
                                                onChange={e => setBasicInfo({ ...basicInfo, description: e.target.value })}
                                                className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f6423a] focus:outline-none transition resize-none text-sm"
                                                placeholder="Detailed product description..."
                                            />
                                        </div>
                                    </FormSection>

                                    <FormSection title="Settings & Visibility">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Toggle label="Active (Visible)" checked={basicInfo.is_active} onChange={c => setBasicInfo({ ...basicInfo, is_active: c })} />
                                            <Toggle label="Featured Product" checked={basicInfo.is_featured} onChange={c => setBasicInfo({ ...basicInfo, is_featured: c })} />
                                            <Toggle label="Show Price" checked={basicInfo.is_price_visible} onChange={c => setBasicInfo({ ...basicInfo, is_price_visible: c })} />
                                            <Toggle label="Customizable" checked={basicInfo.is_customizable} onChange={c => setBasicInfo({ ...basicInfo, is_customizable: c })} />
                                        </div>
                                        {basicInfo.is_customizable && (
                                            <div className="mt-4 animate-fadeIn">
                                                <InputGroup label="Customization Note" value={basicInfo.customization_note} onChange={v => setBasicInfo({ ...basicInfo, customization_note: v })} placeholder="e.g. Dimensions can be customized" />
                                            </div>
                                        )}
                                    </FormSection>
                                </div>
                            </div>
                        )}

                        {/* MATERIALS */}
                        {activeTab === 'materials' && (
                            <div className="animate-fadeIn space-y-6">
                                <div className="bg-[#0a1642] p-6 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Available Materials</h3>
                                            <p className="text-sm text-gray-400">Select materials valid for this product</p>
                                        </div>
                                        <span className="text-xs bg-[#f6423a]/10 text-[#f6423a] px-3 py-1 rounded-full font-medium">
                                            {selectedMaterials.length} selected
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {materials.map((mat: any) => (
                                            <label
                                                key={mat.id}
                                                className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedMaterials.includes(mat.id)
                                                    ? 'bg-[#f6423a]/10 border-[#f6423a]'
                                                    : 'bg-[#050b2b] border-white/5 hover:border-white/20 hover:bg-white/5'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedMaterials.includes(mat.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) setSelectedMaterials([...selectedMaterials, mat.id]);
                                                        else setSelectedMaterials(selectedMaterials.filter(id => id !== mat.id));
                                                    }}
                                                />
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedMaterials.includes(mat.id) ? 'border-[#f6423a] bg-[#f6423a]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                    {selectedMaterials.includes(mat.id) && <MdCheck size={14} className="text-white" />}
                                                </div>
                                                <span className={`text-sm font-medium text-center ${selectedMaterials.includes(mat.id) ? 'text-white' : 'text-gray-400'}`}>{mat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DETAILS (Dimensions & SEO) */}
                        {activeTab === 'details' && (
                            <div className="animate-fadeIn space-y-6">
                                <FormSection title="Dimensions & Weight">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <InputGroup label="Length (cm)" type="number" value={dimensions.length} onChange={v => setDimensions({ ...dimensions, length: v })} />
                                        <InputGroup label="Width (cm)" type="number" value={dimensions.width} onChange={v => setDimensions({ ...dimensions, width: v })} />
                                        <InputGroup label="Height (cm)" type="number" value={dimensions.height} onChange={v => setDimensions({ ...dimensions, height: v })} />
                                        <InputGroup label="Weight (kg)" type="number" value={dimensions.weight} onChange={v => setDimensions({ ...dimensions, weight: v })} />
                                    </div>
                                </FormSection>

                                <FormSection title="SEO (Search Engine Optimization)">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Meta Keywords</label>
                                            <input
                                                type="text"
                                                value={seo.meta_keywords}
                                                onChange={e => setSeo({ ...seo, meta_keywords: e.target.value })}
                                                className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f6423a] focus:outline-none transition text-sm"
                                                placeholder="gate, steel, iron, modern..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Meta Description</label>
                                            <textarea
                                                rows={3}
                                                value={seo.meta_description}
                                                onChange={e => setSeo({ ...seo, meta_description: e.target.value })}
                                                className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f6423a] focus:outline-none transition resize-none text-sm"
                                                placeholder="Brief summary for search engines..."
                                            />
                                        </div>
                                    </div>
                                </FormSection>
                            </div>
                        )}

                        {/* IMAGES */}
                        {activeTab === 'images' && (
                            <div className="animate-fadeIn space-y-6">
                                {/* Upload Area */}
                                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 transition hover:border-[#f6423a]/50 hover:bg-[#f6423a]/5 group text-center cursor-pointer bg-[#0a1642]">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-[#f6423a] transition">
                                        <div className="bg-white/5 p-4 rounded-full group-hover:bg-[#f6423a]/10 transition">
                                            <MdCloudUpload size={32} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-white">Drop images here or click to upload</p>
                                            <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG, WEBP (Max 5MB)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Image List */}
                                <div className="space-y-3">
                                    {[...existingImages, ...newImages].length > 0 && (
                                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Attached Images</h3>
                                    )}

                                    {/* Existing Images */}
                                    {existingImages.map((img) => (
                                        <ImageItem
                                            key={`exist-${img.id}`}
                                            src={getApiImageUrl(img.image)}
                                            isPrimary={img.is_primary}
                                            onSetPrimary={() => handleSetPrimaryExisting(img.id)}
                                            onRemove={() => {/* Existing images removal logic if needed, usually separate API */ }}
                                            isExisting={true}
                                        />
                                    ))}

                                    {/* New Images */}
                                    {newImages.map((img, idx) => (
                                        <ImageItem
                                            key={`new-${idx}`}
                                            src={img.preview}
                                            isPrimary={img.isPrimary}
                                            onSetPrimary={() => handleSetPrimaryNew(idx)}
                                            onRemove={() => handleRemoveNewImage(idx)}
                                            altText={img.altText}
                                            onAltChange={(val) => {
                                                const updated = [...newImages];
                                                updated[idx].altText = val;
                                                setNewImages(updated);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-white/10 bg-[#0a1642] flex justify-between md:justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        disabled={submitting}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-[#f6423a] hover:bg-[#e03229] text-white font-bold shadow-lg shadow-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                        {submitting && <ButtonLoading />}
                        {submitting ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-components for cleaner code
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-[#0a1642] p-6 rounded-2xl border border-white/5">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 border-b border-white/5 pb-2">{title}</h3>
        {children}
    </div>
);

const InputGroup = ({ label, type = 'text', value, onChange, required, placeholder }: any) => (
    <div>
        <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f6423a] focus:outline-none transition text-sm font-medium placeholder-gray-600"
            placeholder={placeholder}
        />
    </div>
);

const SelectGroup = ({ label, value, onChange, options, required }: any) => (
    <div>
        <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                className="w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f6423a] focus:outline-none transition text-sm appearance-none cursor-pointer"
            >
                <option value="">Select Option</option>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <MdExpandMore size={20} />
            </div>
        </div>
    </div>
);

const Toggle = ({ label, checked, onChange }: any) => (
    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${checked ? 'bg-[#f6423a]/10 border-[#f6423a]/30' : 'bg-[#050b2b] border-white/5 hover:border-white/10'}`}>
        <span className={`text-sm font-medium ${checked ? 'text-white' : 'text-gray-400'}`}>{label}</span>
        <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-[#f6423a]' : 'bg-gray-700'}`}>
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            <input type="checkbox" className="hidden" checked={checked} onChange={e => onChange(e.target.checked)} />
        </div>
    </label>
);

const ImageItem = ({ src, isPrimary, onSetPrimary, onRemove, altText, onAltChange, isExisting }: any) => (
    <div className="flex gap-4 p-3 bg-[#0a1642] rounded-xl border border-white/5 items-center group hover:border-white/20 transition">
        <div className="relative w-20 h-20 shrink-0">
            <img src={src} alt="Preview" className="w-full h-full object-cover rounded-lg bg-black/40" />
            {isPrimary && (
                <div className="absolute top-1 left-1 bg-[#f6423a] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">Primary</div>
            )}
        </div>

        <div className="flex-1 min-w-0">
            {!isExisting ? (
                <input
                    type="text"
                    placeholder="Describe this image (for SEO)"
                    value={altText}
                    onChange={e => onAltChange(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 pb-1 text-sm text-white focus:border-[#f6423a] focus:outline-none mb-2 placeholder-gray-600"
                />
            ) : (
                <p className="text-sm text-gray-400 mb-2 italic">Existing Product Image</p>
            )}

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onSetPrimary}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${isPrimary ? 'bg-[#f6423a]/20 text-[#f6423a] cursor-default' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                >
                    {isPrimary ? 'Primary Image' : 'Set as Primary'}
                </button>
            </div>
        </div>

        {!isExisting && (
            <button
                type="button"
                onClick={onRemove}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition shrink-0"
                title="Remove Image"
            >
                <MdDelete size={20} />
            </button>
        )}
    </div>
);
