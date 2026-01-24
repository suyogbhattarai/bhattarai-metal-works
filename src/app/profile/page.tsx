'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/utils/lib/redux/Store'
import { 
  fetchUserProfile, 
  updateUserProfile, 
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '@/utils/lib/redux/features/auth/authSlice'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, loading, addresses, error } = useAppSelector((state) => state.auth)
  
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profile_picture: null as File | null,
  })
  
  const [addressFormData, setAddressFormData] = useState({
    street_address: '',
    apartment_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    is_default_shipping: false,
    is_default_billing: false,
  })
  
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!user) {
      dispatch(fetchUserProfile() as any)
    } else {
      initializeProfileForm()
    }

    dispatch(fetchAddresses() as any)
  }, [isAuthenticated])

  useEffect(() => {
    if (user) {
      initializeProfileForm()
      setPreviewImage(user.profile_picture || null)
    }
  }, [user])

  const initializeProfileForm = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        profile_picture: null,
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file')
        return
      }

      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateProfileForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (formData.phone_number && !/^[\d\s\-\+\(\)]+$/.test(formData.phone_number)) {
      errors.phone_number = 'Please enter a valid phone number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateAddressForm = () => {
    const errors: Record<string, string> = {}

    if (!addressFormData.street_address.trim()) {
      errors.street_address = 'Street address is required'
    }
    if (!addressFormData.city.trim()) {
      errors.city = 'City is required'
    }
    if (!addressFormData.state.trim()) {
      errors.state = 'State/Province is required'
    }
    if (!addressFormData.zip_code.trim()) {
      errors.zip_code = 'Zip code is required'
    }
    if (!addressFormData.country.trim()) {
      errors.country = 'Country is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      setErrorMessage('Please fix the errors in the form')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      const form = new FormData()
      
      form.append('first_name', formData.first_name)
      form.append('last_name', formData.last_name)
      form.append('email', formData.email)
      form.append('phone_number', formData.phone_number)
      if (formData.profile_picture) {
        form.append('profile_picture', formData.profile_picture)
      }

      const result = await dispatch(updateUserProfile(form) as any)
      
      if (result.meta.requestStatus === 'fulfilled') {
        setIsEditing(false)
        setFormData(prev => ({
          ...prev,
          profile_picture: null
        }))
        setSuccessMessage('✅ Profile updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage(result.payload || 'Failed to update profile')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) {
      setErrorMessage('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (editingAddressId) {
        // Update existing address
        const result = await dispatch(
          updateAddress({ id: editingAddressId, data: addressFormData }) as any
        )
        
        if (result.meta.requestStatus === 'fulfilled') {
          setEditingAddressId(null)
          setSuccessMessage('✅ Address updated successfully!')
          resetAddressForm()
          setTimeout(() => setSuccessMessage(''), 3000)
        } else {
          setErrorMessage(result.payload || 'Failed to update address')
        }
      } else {
        // Add new address
        const result = await dispatch(addAddress(addressFormData) as any)
        
        if (result.meta.requestStatus === 'fulfilled') {
          setIsAddingAddress(false)
          setSuccessMessage('✅ Address added successfully!')
          resetAddressForm()
          setTimeout(() => setSuccessMessage(''), 3000)
        } else {
          setErrorMessage(result.payload || 'Failed to add address')
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving address')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setErrorMessage('')
      setSuccessMessage('')

      try {
        const result = await dispatch(deleteAddress(id) as any)
        
        if (result.meta.requestStatus === 'fulfilled') {
          setSuccessMessage('✅ Address deleted successfully!')
          setTimeout(() => setSuccessMessage(''), 3000)
        } else {
          setErrorMessage(result.payload || 'Failed to delete address')
        }
      } catch (err: any) {
        setErrorMessage('Error deleting address')
      }
    }
  }

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id)
    setAddressFormData({
      street_address: addr.street_address,
      apartment_address: addr.apartment_address || '',
      city: addr.city,
      state: addr.state,
      zip_code: addr.zip_code,
      country: addr.country,
      is_default_shipping: addr.is_default_shipping,
      is_default_billing: addr.is_default_billing,
    })
    setActiveTab('addresses')
    setFormErrors({})
  }

  const resetAddressForm = () => {
    setAddressFormData({
      street_address: '',
      apartment_address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      is_default_shipping: false,
      is_default_billing: false,
    })
    setEditingAddressId(null)
    setIsAddingAddress(false)
    setFormErrors({})
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071236]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
          <p className="text-white mt-4">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071236]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#f6423a]"></div>
          <p className="text-white mt-4">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user.role === 'admin' || user.is_admin
  const isStaff = user.role === 'staff' || user.is_staff

  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-[#071236] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Alert Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg flex items-center gap-3 animate-in fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg flex items-center gap-3 animate-in fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#0a1f4a] to-[#071236] rounded-xl shadow-lg p-8 border border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 overflow-hidden flex-shrink-0 border-4 border-[#f6423a]">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : user.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f6423a] text-white font-bold text-4xl">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#f6423a] hover:bg-[#e03229] rounded-full p-2 cursor-pointer transition shadow-lg">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user.username}
              </h1>
              <p className="text-gray-400 mb-3">@{user.username}</p>
              
              {(isAdmin || isStaff) && (
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                  <span className="px-3 py-1 bg-[#f6423a] text-white text-sm font-semibold rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
              )}

              <p className="text-gray-300 text-sm mb-2">
                📧 {user.email}
              </p>
              {user.phone_number && (
                <p className="text-gray-300 text-sm mb-4">
                  📞 {user.phone_number}
                </p>
              )}

              {!isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setFormErrors({})
                  }}
                  className="mt-4 bg-[#f6423a] hover:bg-[#e03229] text-white px-6 py-2 rounded-full font-semibold transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => {
              setActiveTab('profile')
              setFormErrors({})
            }}
            className={`px-4 py-3 font-semibold transition ${activeTab === 'profile' ? 'text-[#f6423a] border-b-2 border-[#f6423a]' : 'text-gray-400 hover:text-white'}`}
          >
            Profile Information
          </button>
          <button
            onClick={() => {
              setActiveTab('addresses')
              setFormErrors({})
            }}
            className={`px-4 py-3 font-semibold transition ${activeTab === 'addresses' ? 'text-[#f6423a] border-b-2 border-[#f6423a]' : 'text-gray-400 hover:text-white'}`}
          >
            Addresses ({addresses?.length || 0})
          </button>
        </div>

        {/* Edit Profile Form */}
        {activeTab === 'profile' && (
          <>
            {isEditing ? (
              <div className="bg-gradient-to-br from-[#0a1f4a] to-[#071236] rounded-xl shadow-lg p-8 border border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-[#f6423a] focus:outline-none transition"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-[#f6423a] focus:outline-none transition"
                      placeholder="Last name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Email {formErrors.email && <span className="text-red-400 text-sm">*</span>}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-800 border text-white focus:outline-none transition ${formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#f6423a]'}`}
                      placeholder="Email"
                    />
                    {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Phone Number {formErrors.phone_number && <span className="text-red-400 text-sm">*</span>}
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-800 border text-white focus:outline-none transition ${formErrors.phone_number ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#f6423a]'}`}
                      placeholder="Phone number"
                    />
                    {formErrors.phone_number && <p className="text-red-400 text-sm mt-1">{formErrors.phone_number}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-white font-semibold mb-2">Profile Picture</label>
                    <div className="flex gap-4 items-start">
                      <div className="w-20 h-20 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-gray-600">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : user.profile_picture ? (
                          <img 
                            src={user.profile_picture} 
                            alt="current" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#f6423a] text-white text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#f6423a] hover:bg-gray-700 transition">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="text-center">
                            <svg className="w-6 h-6 text-[#f6423a] mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-white font-semibold text-sm">Click to upload</p>
                            <p className="text-gray-400 text-xs">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        </label>
                        {formData.profile_picture && (
                          <p className="text-sm text-green-400 mt-2">✓ {formData.profile_picture.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 bg-[#f6423a] hover:bg-[#e03229] text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      initializeProfileForm()
                      setPreviewImage(user.profile_picture || null)
                      setFormErrors({})
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Account Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gradient-to-br from-[#0a1f4a] to-[#071236] rounded-xl shadow-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">📋 Account Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">Member Since</p>
                        <p className="text-white font-semibold">
                          {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Last Login</p>
                        <p className="text-white font-semibold">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Never logged in'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Account Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-white font-semibold">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(isAdmin || isStaff) && (
                    <div className="bg-gradient-to-br from-[#0a1f4a] to-[#071236] rounded-xl shadow-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-4">🔐 Admin Info</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-sm">Role</p>
                          <p className="text-[#f6423a] font-semibold capitalize text-lg">{user.role}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Permissions</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {isAdmin && (
                              <span className="px-3 py-1 bg-[#f6423a] text-white text-xs font-semibold rounded">Admin Access</span>
                            )}
                            {isStaff && (
                              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">Staff Access</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <>
            {isAddingAddress || editingAddressId ? (
              <div className="bg-gradient-to-br from-[#0a1f4a] to-[#071236] rounded-xl shadow-lg p-8 border border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingAddressId ? '✏️ Edit Address' : '➕ Add New Address'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="sm:col-span-2">
                    <label className="block text-white font-semibold mb-2">
                      Street Address {formErrors.street_address && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      name="street_address"
                      value={addressFormData.street_address}
                      onChange={handleAddressInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-800 border text-white focus:outline-none transition ${formErrors.street_address ? 'border-red-500' : 'border-gray-700 focus:border-[#f6423a]'}`}
                      placeholder="Street address"
                    />
                    {formErrors.street_address && <p className="text-red-400 text-sm mt-1">{formErrors.street_address}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-white font-semibold mb-2">Apartment/Suite (Optional)</label>
                    <input
                      type="text"
                      name="apartment_address"
                      value={addressFormData.apartment_address}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-[#f6423a] focus:outline-none transition"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      City {formErrors.city && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressFormData.city}
                      onChange={handleAddressInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-800 border text-white focus:outline-none transition ${formErrors.city ? 'border-red-500' : 'border-gray-700 focus:border-[#f6423a]'}`}
                      placeholder="City"
                    />
                    {formErrors.city && <p className="text-red-400 text-sm mt-1">{formErrors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      State/Province {formErrors.state && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={addressFormData.state}
                      onChange={handleAddressInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-800 border text-white focus:outline-none transition ${formErrors.state ? 'border-red-500' : 'border-gray-700 focus:border-[#f6423a]'}`}
                      placeholder="State/Province"
                    />
                    {formErrors.state && <p className="text-red-400 text-sm mt-1">{formErrors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Zip Code {formErrors.zip_code && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={addressFormData.zip_code}
                      onChange={handleAddressInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-800 border text-white focus:outline-none transition ${formErrors.zip_code ? 'border-red-500' : 'border-gray-700 focus:border-[#f6423a]'}`}
                      placeholder="Zip code"
                    />
                    {formErrors.zip_code && <p className="text-red-400 text-sm mt-1">{formErrors.zip_code}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Country {formErrors.country && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={addressFormData.country}
                      onChange={handleAddressInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-800 border text-white focus:outline-none transition ${formErrors.country ? 'border-red-500' : 'border-gray-700 focus:border-[#f6423a]'}`}
                      placeholder="Country"
                    />
                    {formErrors.country && <p className="text-red-400 text-sm mt-1">{formErrors.country}</p>}
                  </div>
                </div>

                <div className="space-y-3 mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <label className="flex items-center gap-3 text-white cursor-pointer hover:bg-gray-700 p-2 rounded transition">
                    <input
                      type="checkbox"
                      name="is_default_shipping"
                      checked={addressFormData.is_default_shipping}
                      onChange={handleAddressInputChange}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="font-semibold">Set as default shipping address</span>
                  </label>

                  <label className="flex items-center gap-3 text-white cursor-pointer hover:bg-gray-700 p-2 rounded transition">
                    <input
                      type="checkbox"
                      name="is_default_billing"
                      checked={addressFormData.is_default_billing}
                      onChange={handleAddressInputChange}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="font-semibold">Set as default billing address</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveAddress}
                    disabled={isSaving}
                    className="flex-1 bg-[#f6423a] hover:bg-[#e03229] text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
                  </button>
                  <button
                    onClick={resetAddressForm}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#0a1f4a] to-[#071236] rounded-xl shadow-lg p-6 border border-gray-700 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">📍 Saved Addresses</h3>
                  <button
                    onClick={() => {
                      setIsAddingAddress(true)
                      setFormErrors({})
                    }}
                    className="bg-[#f6423a] hover:bg-[#e03229] text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    + Add Address
                  </button>
                </div>
                
                {addresses && addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-[#f6423a] transition">
                        <p className="text-white font-semibold mb-2">{addr.street_address}</p>
                        {addr.apartment_address && <p className="text-gray-400 text-sm">{addr.apartment_address}</p>}
                        <p className="text-gray-400 text-sm">
                          {addr.city}, {addr.state} {addr.zip_code}
                        </p>
                        <p className="text-gray-400 text-sm mb-3">{addr.country}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4 text-xs">
                          {addr.is_default_shipping && (
                            <span className="px-2 py-1 bg-green-600 text-white rounded font-semibold">✓ Default Shipping</span>
                          )}
                          {addr.is_default_billing && (
                            <span className="px-2 py-1 bg-blue-600 text-white rounded font-semibold">✓ Default Billing</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(addr)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">No saved addresses yet</p>
                    <button
                      onClick={() => {
                        setIsAddingAddress(true)
                        setFormErrors({})
                      }}
                      className="bg-[#f6423a] hover:bg-[#e03229] text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}  
          </>
        )}
      </div>
    </div>
    <Footer/>
    </>
  
  )
}