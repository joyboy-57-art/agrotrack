import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Tractor, AlertCircle, Eye, EyeOff, Leaf, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const ROLES = [
    { id: 'farmer', label: 'Farmer', desc: 'Rent equipment for your farm', icon: <Leaf className="w-5 h-5" /> },
    { id: 'admin', label: 'Admin/Owner', desc: 'List and manage equipment', icon: <ShieldCheck className="w-5 h-5" /> },
];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'farmer',
        mobile_number: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Form Validation logic
    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.mobile_number.length !== 10 || !/^\d{10}$/.test(formData.mobile_number)) {
            setError('Please enter a valid 10-digit mobile number');
            return false;
        }
        return true;
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            await authService.register(formData);
            navigate('/login', { state: { message: 'Registration successful. Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-agro-800 via-agro-700 to-agro-500 flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute bottom-40 -left-10 w-60 h-60 bg-white/5 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Tractor className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-black text-white">AgroTrack</span>
                    </div>
                    <h1 className="text-4xl font-black text-white leading-tight mb-4">
                        Join the Future<br />of <span className="text-agro-200">Farming</span>
                    </h1>
                    <p className="text-agro-100 leading-relaxed max-w-xs">
                        Connect with thousands of farmers and equipment owners on India's smartest agri-tech platform.
                    </p>
                </div>

                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-6">
                    <p className="text-white font-bold mb-1">🌱 2,400+ Active Users</p>
                    <p className="text-agro-100 text-sm">Join our growing community of farmers and equipment owners.</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-agro-600 rounded-xl flex items-center justify-center">
                            <Tractor className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black text-gray-900">AgroTrack</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create your account</h2>
                        <p className="text-gray-500">It only takes a minute to get started</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 p-8">
                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                            {/* Role Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">I am a...</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {ROLES.map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: role.id })}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.role === role.id
                                                ? 'border-agro-500 bg-agro-50 text-agro-700'
                                                : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className={`mb-2 ${formData.role === role.id ? 'text-agro-600' : 'text-gray-400'}`}>
                                                {role.icon}
                                            </div>
                                            <p className="font-bold text-sm">{role.label}</p>
                                            <p className="text-xs mt-0.5 opacity-70">{role.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 pointer-events-none">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ramesh Kumar"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all relative z-20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 pointer-events-none">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all relative z-20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 pointer-events-none">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        value={formData.mobile_number}
                                        onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value.replace(/\D/g, '') })}
                                        placeholder="9876543210"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all relative z-20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 pointer-events-none">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min. 6 characters"
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

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 pointer-events-none">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Confirm your password"
                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all relative z-20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-30 touch-manipulation"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {successMsg && (
                                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm font-medium">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
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
                                        Complete Registration <UserPlus className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-50 text-center">
                            <p className="text-gray-500 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-agro-600 font-bold hover:text-agro-700 underline underline-offset-2">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
