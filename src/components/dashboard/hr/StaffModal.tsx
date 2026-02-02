'use client';

import React, { useState } from 'react';
import {
    MdClose,
    MdCloudUpload,
    MdPerson,
    MdPhone,
    MdBadge,
    MdEmail,
    MdLock,
    MdDateRange,
    MdWork,
    MdAttachMoney,
    MdDescription,
    MdDone,
    MdPhotoCamera
} from 'react-icons/md';
import { ButtonLoading } from '@/components/Loading';

interface StaffModalProps {
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    submitting: boolean;
}

export default function StaffModal({ onClose, onSubmit, submitting }: StaffModalProps) {
    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState({
        // User Info
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        // Profile Info
        staff_type: 'full_time',
        designation: '',
        joining_date: '',
        phone_number: '',
        emergency_contact: '',
        citizenship_number: '',
        pan_number: '',
        base_salary: '',
        // Files
        profile_picture: null as File | null,
        citizenship_front: null as File | null,
        citizenship_back: null as File | null,
        contract_doc: null as File | null,
    });

    const [previews, setPreviews] = useState({
        profile: '',
        citizen_front: '',
        citizen_back: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
            if (field === 'profile_picture' || field === 'citizenship_front' || field === 'citizenship_back') {
                const previewKey = field === 'profile_picture' ? 'profile' : field === 'citizenship_front' ? 'citizen_front' : 'citizen_back';
                setPreviews(prev => ({ ...prev, [previewKey]: URL.createObjectURL(file) }));
            }
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();

        // Structure for StaffCreateSerializer
        // user_data
        data.append('user_data.username', formData.username);
        data.append('user_data.email', formData.email);
        data.append('user_data.password', formData.password || 'Staff@123');
        data.append('user_data.first_name', formData.first_name);
        data.append('user_data.last_name', formData.last_name);

        // Staff Info
        data.append('staff_type', formData.staff_type);
        data.append('designation', formData.designation);
        data.append('joining_date', formData.joining_date);
        data.append('phone_number', formData.phone_number);
        data.append('emergency_contact', formData.emergency_contact);
        data.append('citizenship_number', formData.citizenship_number);
        data.append('pan_number', formData.pan_number);
        data.append('base_salary', formData.base_salary);

        // Files
        if (formData.profile_picture) data.append('user_data.profile_picture', formData.profile_picture);
        if (formData.citizenship_front) data.append('citizenship_front', formData.citizenship_front);
        if (formData.citizenship_back) data.append('citizenship_back', formData.citizenship_back);
        if (formData.contract_doc) data.append('contract_doc', formData.contract_doc);

        onSubmit(data);
    };

    const inputClass = "w-full bg-[#050b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f6423a] transition text-sm font-medium placeholder-gray-600";
    const labelClass = "block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2";

    const steps = [
        { id: 1, label: 'Basic Info', icon: <MdPerson /> },
        { id: 2, label: 'Job Details', icon: <MdWork /> },
        { id: 3, label: 'Documents', icon: <MdBadge /> }
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-[#111e48] rounded-[2rem] max-w-2xl w-full border border-white/10 shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a1642]/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">Add New Staff</h2>
                        <p className="text-xs text-gray-500 mt-1">Onboard a new employee or freelancer to the system.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-[#0e1736] px-8 py-4 border-b border-white/5 flex justify-between">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${activeStep >= step.id ? 'bg-[#f6423a] text-white shadow-lg shadow-red-900/20' : 'bg-white/5 text-gray-500'}`}>
                                {activeStep > step.id ? <MdDone size={18} /> : step.id}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep >= step.id ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>
                            {step.id < 3 && <div className="hidden sm:block w-12 h-px bg-white/5 ml-2" />}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-[#0e1736]">
                    {activeStep === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-[2rem] bg-[#050b2b] border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center text-gray-600 transition group-hover:border-[#f6423a]/50">
                                        {previews.profile ? (
                                            <img src={previews.profile} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <MdPhotoCamera size={32} />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'profile_picture')}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-[#f6423a] text-white p-2 rounded-xl shadow-lg">
                                        <MdCloudUpload size={14} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4 text-center">Profile Photo (Optional)</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>First Name *</label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input required className={`${inputClass} pl-12`} placeholder="Sohan" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Last Name *</label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input required className={`${inputClass} pl-12`} placeholder="Bhattarai" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Username *</label>
                                    <div className="relative">
                                        <MdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input required className={`${inputClass} pl-12`} placeholder="sohan123" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address *</label>
                                    <div className="relative">
                                        <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input required type="email" className={`${inputClass} pl-12`} placeholder="sohan@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Account Password</label>
                                <div className="relative">
                                    <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input type="password" className={`${inputClass} pl-12`} placeholder="Minimum 8 characters" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div>
                                <label className={labelClass}>Employment Type</label>
                                <select
                                    className={inputClass}
                                    value={formData.staff_type}
                                    onChange={e => setFormData({ ...formData, staff_type: e.target.value })}
                                >
                                    <option value="full_time">Full Time Employee</option>
                                    <option value="freelancer">Freelancer / Project-based</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Designation</label>
                                    <div className="relative">
                                        <MdWork className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input className={`${inputClass} pl-12`} placeholder="Structural Engineer" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Joining Date</label>
                                    <div className="relative">
                                        <MdDateRange className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input type="date" className={`${inputClass} pl-12`} value={formData.joining_date} onChange={e => setFormData({ ...formData, joining_date: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Active Phone Number</label>
                                    <div className="relative">
                                        <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input className={`${inputClass} pl-12`} placeholder="+977 98..." value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Base Salary (Monthly)</label>
                                    <div className="relative">
                                        <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input type="number" className={`${inputClass} pl-12`} placeholder="NPR 50,000" value={formData.base_salary} onChange={e => setFormData({ ...formData, base_salary: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeStep === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Citizenship Image (Front) - Optional</label>
                                    <div className="relative border-2 border-dashed border-white/5 rounded-xl p-4 bg-[#050b2b] flex flex-col items-center justify-center text-gray-500 hover:border-[#f6423a]/30 transition group cursor-pointer">
                                        {previews.citizen_front ? (
                                            <img src={previews.citizen_front} className="w-full h-32 object-cover rounded-lg" />
                                        ) : (
                                            <>
                                                <MdCloudUpload size={24} className="mb-2" />
                                                <span className="text-[10px] font-bold">Upload Front</span>
                                            </>
                                        )}
                                        <input type="file" onChange={e => handleFileChange(e, 'citizenship_front')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Citizenship Image (Back) - Optional</label>
                                    <div className="relative border-2 border-dashed border-white/5 rounded-xl p-4 bg-[#050b2b] flex flex-col items-center justify-center text-gray-500 hover:border-[#f6423a]/30 transition group cursor-pointer">
                                        {previews.citizen_back ? (
                                            <img src={previews.citizen_back} className="w-full h-32 object-cover rounded-lg" />
                                        ) : (
                                            <>
                                                <MdCloudUpload size={24} className="mb-2" />
                                                <span className="text-[10px] font-bold">Upload Back</span>
                                            </>
                                        )}
                                        <input type="file" onChange={e => handleFileChange(e, 'citizenship_back')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Citizenship Number - Optional</label>
                                    <input className={inputClass} placeholder="27-01-75-..." value={formData.citizenship_number} onChange={e => setFormData({ ...formData, citizenship_number: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>PAN Number</label>
                                    <input className={inputClass} placeholder="60..." value={formData.pan_number} onChange={e => setFormData({ ...formData, pan_number: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Employment Contract (PDF/Doc) - Optional</label>
                                <div className="relative border border-white/5 bg-[#050b2b] rounded-xl px-4 py-3 flex items-center justify-between">
                                    <span className="text-gray-600 text-sm truncate">{formData.contract_doc?.name || 'No file selected'}</span>
                                    <label className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-lg cursor-pointer transition">
                                        Choose File
                                        <input type="file" onChange={e => handleFileChange(e, 'contract_doc')} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-[#0a1642]/50 flex justify-between items-center">
                    {activeStep > 1 ? (
                        <button
                            type="button"
                            onClick={() => setActiveStep(prev => prev - 1)}
                            className="text-gray-400 hover:text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/5 transition"
                        >
                            Previous Step
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-sm px-6 py-3 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        {activeStep < 3 ? (
                            <button
                                type="button"
                                onClick={() => setActiveStep(prev => prev + 1)}
                                className="bg-[#f6423a] hover:bg-[#e03229] text-white font-bold text-sm px-8 py-3 rounded-xl transition shadow-lg shadow-red-900/20"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                type="submit"
                                onClick={handleFormSubmit}
                                disabled={submitting}
                                className="bg-[#f6423a] hover:bg-[#e03229] text-white font-bold text-sm px-10 py-3 rounded-xl transition shadow-xl shadow-red-900/40 flex items-center gap-2"
                            >
                                {submitting ? <ButtonLoading /> : 'Complete Onboarding'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
