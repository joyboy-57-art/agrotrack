import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import authService from '../services/authService';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // The email and optional success message passed from ForgotPassword
    const email = location.state?.email;
    const incomingMessage = location.state?.message;

    useEffect(() => {
        if (!email) {
            // Safety fallback if accessed directly
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.verifyResetOtp(email, otp);
            // On success, redirect to Reset Password page, carrying the email forward
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
            setLoading(false);
        }
    };

    if (!email) return null; // Prevent flicker before redirect

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-agro-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                        <KeyRound className="w-10 h-10 text-white transform rotate-6" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">Verify OTP</h2>
                <p className="mt-2 text-center text-sm text-gray-600 font-medium px-4">
                    Enter the 6-digit verification code sent to <br /><span className="font-bold text-gray-900">{email}</span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100 sm:px-10">

                    {incomingMessage && !error && (
                        <div className="mb-6 flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm font-medium">
                            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{incomingMessage}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-2 text-center">
                                6-Digit Code
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                maxLength={6}
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Nuance: digits only
                                placeholder="••••••"
                                className="appearance-none block w-full text-center tracking-[0.5em] text-2xl py-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-900 font-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-agro-600 hover:bg-agro-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agro-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <Link to="/forgot-password" className="font-bold text-agro-600 hover:text-agro-500 inline-flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Change Email
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
