'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '@/utils/lib/redux/features/management/managementSlice';
import { useToast, ToastContainer } from '@/components/toast';
import {
    MdArrowBack,
    MdCloudUpload,
    MdPerson,
    MdPhone,
    MdBadge,
    MdEmail,
    MdLock,
    MdDateRange,
    MdWork,
    MdAttachMoney,
    MdDone,
    MdPhotoCamera,
    MdDelete,
    MdCloudDownload
} from 'react-icons/md';
import Link from 'next/link';

export default function StaffDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { staff, staffLoading } = useSelector((state: RootState) => state.management);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    const [submitting, setSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        staff_type: 'full_time',
        designation: '',
        joining_date: '',
        phone_number: '',
        emergency_contact: '',
        citizenship_number: '',
        pan_number: '',
        base_salary: '',
        profile_picture: null as File | null,
        citizenship_front: null as File | null,
        citizenship_back: null as File | null,
        contract_doc: null as File | null,
        is_active: true,
    });

    const [previews, setPreviews] = useState({
        profile: '',
        citizen_front: '',
        citizen_back: '',
    });
    const [errors, setErrors] = useState<any>({});

    const isNew = id === 'new';
    const currentStaff = !isNew ? staff.find(s => s.id === parseInt(id as string)) : null;

    useEffect(() => {
        dispatch(fetchStaff() as any);
    }, [dispatch]);

    useEffect(() => {
        if (currentStaff) {
            const details = currentStaff.user_data || currentStaff.user_details || {};
            setFormData({
                username: details.username || '',
                email: details.email || '',
                password: '', // Don't populate password
                first_name: details.first_name || '',
                last_name: details.last_name || '',
                staff_type: currentStaff.staff_type || 'full_time',
                designation: currentStaff.designation || '',
                joining_date: currentStaff.joining_date || '',
                phone_number: currentStaff.phone_number || '',
                emergency_contact: currentStaff.emergency_contact || '',
                citizenship_number: currentStaff.citizenship_number || '',
                pan_number: currentStaff.pan_number || '',
                base_salary: currentStaff.base_salary || '',
                profile_picture: null,
                citizenship_back: null,
                contract_doc: null,
                is_active: currentStaff.is_active,
            });

            // Set previews if images exist (assuming backend sends URLs)
            if (currentStaff.profile_picture) {
                setPreviews(prev => ({ ...prev, profile: currentStaff.profile_picture as string }));
            }
        }
    }, [currentStaff]);

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

    const handleDelete = async () => {
        if (!currentStaff) return;
        if (confirm('Are you sure you want to delete this staff profile permanently?')) {
            try {
                await dispatch(deleteStaff(currentStaff.id) as any).unwrap();
                showSuccess('Staff profile deleted');
                router.push('/dashboard/hr');
            } catch (error: any) {
                showError('Failed to delete staff');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if not on last step (e.g. Enter key)
        if (activeStep < 3) {
            setActiveStep(prev => prev + 1);
            return;
        }

        setSubmitting(true);
        setErrors({});

        const data = new FormData();
        data.append('user_data.username', formData.username);
        data.append('user_data.email', formData.email);
        data.append('user_data.password', formData.password || 'Staff@123');
        data.append('user_data.first_name', formData.first_name);
        data.append('user_data.last_name', formData.last_name);
        data.append('staff_type', formData.staff_type);
        data.append('designation', formData.designation);
        data.append('joining_date', formData.joining_date);
        data.append('phone_number', formData.phone_number);
        data.append('emergency_contact', formData.emergency_contact);
        data.append('citizenship_number', formData.citizenship_number);
        data.append('pan_number', formData.pan_number);
        data.append('base_salary', formData.base_salary);

        data.append('base_salary', formData.base_salary);
        data.append('is_active', formData.is_active.toString());

        if (formData.profile_picture) data.append('profile_picture', formData.profile_picture);
        if (formData.citizenship_front) data.append('citizenship_front', formData.citizenship_front);
        if (formData.citizenship_back) data.append('citizenship_back', formData.citizenship_back);
        if (formData.contract_doc) data.append('contract_doc', formData.contract_doc);

        try {
            if (isNew) {
                await dispatch(createStaff(data) as any).unwrap();
                showSuccess('Staff member onboarded successfully');
            } else {
                if (currentStaff) {
                    await dispatch(updateStaff({ id: currentStaff.id, data }) as any).unwrap();
                    showSuccess('Staff profile updated successfully');
                }
            }
            await dispatch(fetchStaff() as any);
            router.push('/dashboard/hr');
        } catch (err: any) {
            console.error('Validation Error:', err);
            if (typeof err === 'object' && err !== null) {
                // Handle nested user_data errors
                const flatErrors: any = { ...err };
                if (err.user_data) {
                    Object.keys(err.user_data).forEach(key => {
                        flatErrors[key] = err.user_data[key];
                    });
                }
                setErrors(flatErrors);

                // Auto-switch to step with error
                const step1Fields = ['username', 'email', 'password', 'first_name', 'last_name', 'profile_picture'];
                const step2Fields = ['staff_type', 'designation', 'joining_date', 'phone_number', 'base_salary'];

                const hasStep1Error = Object.keys(flatErrors).some(key => step1Fields.includes(key));
                const hasStep2Error = Object.keys(flatErrors).some(key => step2Fields.includes(key));

                if (hasStep1Error) {
                    setActiveStep(1);
                } else if (hasStep2Error) {
                    setActiveStep(2);
                }

                // Show first error in toast
                const firstKey = Object.keys(flatErrors)[0];
                if (firstKey) {
                    const firstError = Array.isArray(flatErrors[firstKey]) ? flatErrors[firstKey][0] : flatErrors[firstKey];
                    showError(typeof firstError === 'string' ? firstError : 'Please correct the errors in the form');
                } else {
                    showError('Validation failed. Please check your inputs.');
                }
            } else {
                showError(err || 'Failed to update staff');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (staffLoading && !isNew) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
            </div>
        );
    }

    const getInputClass = (field: string) => {
        const baseClass = "w-full bg-[#050b2b] border rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm font-medium placeholder-gray-600";
        if (errors[field]) {
            return `${baseClass} border-red-500 focus:border-red-500 animate-pulse`;
        }
        return `${baseClass} border-white/10 focus:border-[#f6423a]`;
    };
    const labelClass = "block text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2";

    const steps = [
        { id: 1, label: 'Basic Info', icon: <MdPerson /> },
        { id: 2, label: 'Job Details', icon: <MdWork /> },
        { id: 3, label: 'Documents', icon: <MdBadge /> }
    ];

    return (
        <div className="space-y-6 pb-12">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/hr" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
                        <MdArrowBack size={24} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
                            <span>/</span>
                            <Link href="/dashboard/hr" className="hover:text-white transition">HR</Link>
                            <span>/</span>
                            <span className="text-[#f6423a]">{isNew ? 'New Staff' : (currentStaff?.user_data?.username || currentStaff?.user_details?.username || 'Staff Profile')}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">{isNew ? 'Onboard New Staff' : 'Staff Profile'}</h1>
                    </div>
                </div>
                {!isNew && (
                    <button
                        onClick={handleDelete}
                        className="md:ml-auto w-full md:w-auto justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center gap-2"
                    >
                        <MdDelete size={18} />
                        Delete Staff
                    </button>
                )}
            </div>

            {/* Progress Steps */}
            <div className="bg-[#111e48]/40 border border-white/5 rounded-[2rem] px-8 py-4 flex justify-between">
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-[#111e48]/40 border border-white/5 rounded-[2.5rem] p-8">
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
                                    {previews.profile && (
                                        <a
                                            href={previews.profile}
                                            download={`profile_picture_${formData.username}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute bottom-2 right-2 bg-white/10 hover:bg-white/20 p-2 rounded-full z-20 text-white transition backdrop-blur-md"
                                        >
                                            <MdCloudDownload size={16} />
                                        </a>
                                    )}
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
                                    <input required className={`${getInputClass('first_name')} pl-12`} placeholder="Sohan" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                                </div>
                                {errors.first_name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Last Name *</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input required className={`${getInputClass('last_name')} pl-12`} placeholder="Bhattarai" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                                </div>
                                {errors.last_name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.last_name}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Username *</label>
                                <div className="relative">
                                    <MdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input required className={`${getInputClass('username')} pl-12`} placeholder="sohan123" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                                </div>
                                {errors.username && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.username}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Email Address *</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input required type="email" className={`${getInputClass('email')} pl-12`} placeholder="sohan@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Account Password</label>
                            <div className="relative">
                                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input type="password" className={`${getInputClass('password')} pl-12`} placeholder="Minimum 8 characters" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password}</p>}
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className={labelClass}>Employment Type</label>
                            <select
                                className={getInputClass('staff_type')}
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
                                    <input className={`${getInputClass('designation')} pl-12`} placeholder="Structural Engineer" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Joining Date</label>
                                <div className="relative">
                                    <MdDateRange className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input type="date" className={`${getInputClass('joining_date')} pl-12`} value={formData.joining_date} onChange={e => setFormData({ ...formData, joining_date: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Active Phone Number</label>
                                <div className="relative">
                                    <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input className={`${getInputClass('phone_number')} pl-12`} placeholder="+977 98..." value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
                                </div>
                                {errors.phone_number && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.phone_number}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Base Salary (Monthly)</label>
                                <div className="relative">
                                    <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input type="number" className={`${getInputClass('base_salary')} pl-12`} placeholder="NPR 50,000" value={formData.base_salary} onChange={e => setFormData({ ...formData, base_salary: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div className="bg-[#050b2b] border border-white/5 rounded-xl p-4 mt-6">
                            <label className={labelClass}>Account Status</label>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                className="flex items-center gap-4 w-full"
                            >
                                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-gray-700'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold text-sm ${formData.is_active ? 'text-green-500' : 'text-gray-400'}`}>
                                        {formData.is_active ? 'Active Account' : 'Suspended'}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                        {formData.is_active ? 'User can login and access the system' : 'User access is revoked'}
                                    </p>
                                </div>
                            </button>
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
                                        <div className="relative w-full group/img">
                                            <img src={previews.citizen_front} className="w-full h-32 object-cover rounded-lg" alt="Citizenship Front" />
                                            <a
                                                href={previews.citizen_front}
                                                download={`citizenship_front_${formData.username}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg"
                                            >
                                                <MdCloudDownload className="text-white" size={24} />
                                            </a>
                                        </div>
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
                                        <div className="relative w-full group/img">
                                            <img src={previews.citizen_back} className="w-full h-32 object-cover rounded-lg" alt="Citizenship Back" />
                                            <a
                                                href={previews.citizen_back}
                                                download={`citizenship_back_${formData.username}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg"
                                            >
                                                <MdCloudDownload className="text-white" size={24} />
                                            </a>
                                        </div>
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
                                <input className={getInputClass('citizenship_number')} placeholder="27-01-75-..." value={formData.citizenship_number} onChange={e => setFormData({ ...formData, citizenship_number: e.target.value })} />
                                {errors.citizenship_number && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.citizenship_number}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>PAN Number</label>
                                <input className={getInputClass('pan_number')} placeholder="60..." value={formData.pan_number} onChange={e => setFormData({ ...formData, pan_number: e.target.value })} />
                                {errors.pan_number && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.pan_number}</p>}
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
                                {formData.contract_doc && typeof formData.contract_doc === 'string' && (
                                    <a
                                        href={formData.contract_doc}
                                        target="_blank"
                                        rel="noreferrer"
                                        download
                                        className="ml-2 text-[#f6423a] hover:text-white transition"
                                    >
                                        <MdCloudDownload size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
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
                            onClick={() => router.push('/dashboard/hr')}
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
                                disabled={submitting}
                                className="bg-[#f6423a] hover:bg-[#e03229] text-white font-bold text-sm px-10 py-3 rounded-xl transition shadow-xl shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (isNew ? 'Onboarding...' : 'Updating...') : (isNew ? 'Complete Onboarding' : 'Update Profile')}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
