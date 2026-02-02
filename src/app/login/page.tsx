'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/utils/lib/redux/features/auth/authSlice';
import { AppDispatch, RootState } from '@/utils/lib/redux/Store';
import { useSearchParams } from 'next/navigation';
import { useToast, ToastContainer } from '@/components/toast';
import { ButtonLoading } from '@/components/Loading';
import { Suspense } from 'react';

// Separate component to handle search params and main logic
function AuthContent() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loading, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

    const [isLogin, setIsLogin] = useState(true);
    const [mounted, setMounted] = useState(false);

    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone_number: '',
    });

    const getRedirectPath = (role?: string) => {
        const redirect = searchParams.get('redirect');
        if (redirect) return redirect;
        return role === 'admin' || role === 'staff' ? '/dashboard' : '/portfolio';
    };

    useEffect(() => {
        setMounted(true);

        // Check for session expired param
        if (searchParams.get('sessionExpired') === 'true') {
            showError('Session expired. Please login again.');
            // Clean up URL without refresh
            router.replace('/login');
        }

        if (isAuthenticated && user) {
            const path = getRedirectPath(user.role);
            router.push(path);
        }
        return () => setMounted(false);
    }, [isAuthenticated, user, router, searchParams, showError]);

    if (!mounted) return null;

    return (
        <>
            <Navbar />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex items-center justify-center px-4 py-28 md:px-15 md:py-40">
                <div className="relative w-full max-w-6xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.6)] border border-white/10 bg-white/5 backdrop-blur-2xl">

                    {/* LEFT PANEL */}
                    <div
                        className="hidden md:flex flex-col justify-between p-14 text-white relative"
                        style={{
                            backgroundImage:
                                "linear-gradient(to bottom right, rgba(0,0,0,.7), rgba(0,0,0,.4)), url('https://images.unsplash.com/photo-1581090700227-1e37b190418e')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div>
                            <div className="w-12 h-1 bg-red-500 mb-6 rounded-full" />
                            <h1 className="text-4xl font-extrabold leading-tight">
                                Metal <br /> Fabrication Experts
                            </h1>
                            <p className="mt-4 text-white/80 max-w-sm">
                                Precision welding, heavy fabrication, and industrial-grade craftsmanship you can trust.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="self-start px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur font-semibold transition"
                        >
                            {isLogin ? 'Create Account →' : 'Sign In →'}
                        </button>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex items-center justify-center p-6 md:p-12 bg-[#0c1233]">
                        <div className="w-full max-w-md">
                            <h2 className="text-3xl font-bold text-white">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-400 mt-2 mb-8">
                                {isLogin ? 'Sign in to continue' : 'Fill in your details below'}
                            </p>

                            {isLogin ? (
                                <div className="space-y-6">
                                    <Input icon={<FaUser />} placeholder="Username" name="username"
                                        value={loginData.username}
                                        onChange={(e: any) => setLoginData({ ...loginData, username: e.target.value })}
                                    />
                                    <Input icon={<FaLock />} type="password" placeholder="Password" name="password"
                                        value={loginData.password}
                                        onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })}
                                    />

                                    <PrimaryButton loading={loading} text="Sign In" onClick={async () => {
                                        if (!loginData.username || !loginData.password) {
                                            showError('Username and password are required');
                                            return;
                                        }
                                        try {
                                            const res = await dispatch(loginUser(loginData)).unwrap();
                                            showSuccess('Login successful');
                                            setTimeout(() => router.push(getRedirectPath(res?.user?.role)), 1200);
                                        } catch (err: any) {
                                            showError(err || 'Login failed');
                                        }
                                    }} />
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="First name" name="first_name"
                                            value={signupData.first_name}
                                            onChange={(e: any) => setSignupData({ ...signupData, first_name: e.target.value })}
                                        />
                                        <Input placeholder="Last name" name="last_name"
                                            value={signupData.last_name}
                                            onChange={(e: any) => setSignupData({ ...signupData, last_name: e.target.value })}
                                        />
                                    </div>

                                    <Input icon={<FaUser />} placeholder="Username" name="username"
                                        value={signupData.username}
                                        onChange={(e: any) => setSignupData({ ...signupData, username: e.target.value })}
                                    />
                                    <Input icon={<FaEnvelope />} placeholder="Email" name="email"
                                        value={signupData.email}
                                        onChange={(e: any) => setSignupData({ ...signupData, email: e.target.value })}
                                    />
                                    <Input icon={<FaPhone />} placeholder="Phone" name="phone_number"
                                        value={signupData.phone_number}
                                        onChange={(e: any) => setSignupData({ ...signupData, phone_number: e.target.value })}
                                    />
                                    <Input icon={<FaLock />} type="password" placeholder="Password" name="password"
                                        value={signupData.password}
                                        onChange={(e: any) => setSignupData({ ...signupData, password: e.target.value })}
                                    />
                                    <Input icon={<FaLock />} type="password" placeholder="Confirm Password" name="confirmPassword"
                                        value={signupData.confirmPassword}
                                        onChange={(e: any) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                    />

                                    <PrimaryButton loading={loading} text="Create Account" onClick={async () => {
                                        if (signupData.password !== signupData.confirmPassword) {
                                            showError('Passwords do not match');
                                            return;
                                        }
                                        try {
                                            const res = await dispatch(registerUser({
                                                username: signupData.username,
                                                email: signupData.email,
                                                password: signupData.password,
                                                first_name: signupData.first_name,
                                                last_name: signupData.last_name,
                                                phone_number: signupData.phone_number,
                                            })).unwrap();
                                            showSuccess('Account created');
                                            setTimeout(() => router.push(getRedirectPath(res?.user?.role)), 1200);
                                        } catch (err: any) {
                                            showError(err || 'Registration failed');
                                        }
                                    }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}

/* ---------- UI COMPONENTS ---------- */

function Input({ icon, ...props }: any) {
    return (
        <div className="relative">
            {icon && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {icon}
                </span>
            )}
            <input
                {...props}
                className={`w-full h-12 ${icon ? 'pl-11' : 'pl-4'
                    } pr-4 rounded-xl bg-[#0a0f2c] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition`}
            />
        </div>
    );
}

function PrimaryButton({ loading, text, onClick }: any) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold tracking-wide hover:opacity-90 transition disabled:opacity-50"
        >
            {loading ? <ButtonLoading text={text + '...'} /> : text}
        </button>
    );
}
