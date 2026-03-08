import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Tractor, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-agro-700 via-agro-600 to-agro-500 flex-col justify-between p-16 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute bottom-20 -left-10 w-60 h-60 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 right-10 w-32 h-32 bg-white/10 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Tractor className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">AgroTrack</span>
                    </div>

                    <h1 className="text-5xl font-black text-white leading-tight mb-6">
                        Welcome<br />Back,<br /><span className="text-agro-200">Farmer</span>
                    </h1>
                    <p className="text-agro-100 text-lg leading-relaxed max-w-sm">
                        Manage your equipment rentals, bookings, and farm analytics all in one place.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    {[
                        'Instant equipment rentals',
                        'Real-time booking management',
                        'Admin analytics & reports',
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-agro-200 shrink-0" />
                            <span className="text-agro-100 font-medium">{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-10 h-10 bg-agro-600 rounded-xl flex items-center justify-center">
                            <Tractor className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black text-gray-900">AgroTrack</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Sign in to continue</h2>
                        <p className="text-gray-500">Enter your credentials to access your account</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 p-8">
                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-2xl flex flex-row items-center font-medium">
                                <CheckCircle className="w-5 h-5 mr-3 shrink-0" />
                                {successMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 pointer-events-none">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all relative z-20"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700 pointer-events-none">Password</label>
                                    <Link to="/forgot-password" className="text-sm font-bold text-agro-600 hover:text-agro-700 transition-colors pointer-events-auto">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all relative z-20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-30 touch-manipulation"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium z-10 relative">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-agro-600 hover:bg-agro-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-agro-200 active:scale-[0.98] disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In <LogIn className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-50 text-center">
                            <p className="text-gray-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-agro-600 font-bold hover:text-agro-700 underline underline-offset-2">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-8">
                        © 2025 AgroTrack. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
