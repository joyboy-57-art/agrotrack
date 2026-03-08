import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Tractor, AlertCircle, CheckCircle } from 'lucide-react';
import authService from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            await authService.sendResetOtp(email);
            // Wait shortly to let the user read success feedback optionally, or redirect immediately with state
            navigate('/verify-otp', { state: { email, message: 'OTP sent to your email.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-agro-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                        <Tractor className="w-10 h-10 text-white transform rotate-6" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">Forgot Password</h2>
                <p className="mt-2 text-center text-sm text-gray-600 font-medium">
                    Enter your registered email address format and we'll send you an OTP to securely reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm font-medium">
                                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-agro-600 hover:bg-agro-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agro-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <Link to="/login" className="font-bold text-agro-600 hover:text-agro-500 inline-flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
