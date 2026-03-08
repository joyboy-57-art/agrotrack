import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import authService from '../services/authService';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Strict safety check: Must have email carried over from VerifyOTP
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }

        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        setLoading(true);

        try {
            await authService.resetPassword(email, newPassword, confirmPassword);
            // On hard success, redirect to login with special success message flag
            navigate('/login', { state: { message: 'Password reset successful. Please login with your new password.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again or request a new OTP.');
            setLoading(false);
        }
    };

    if (!email) return null; // Prevent flicker

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-agro-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                        <Lock className="w-10 h-10 text-white transform rotate-6" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">Set New Password</h2>
                <p className="mt-2 text-center text-sm text-gray-600 font-medium px-4">
                    Create a new, strong password for your AgroTrack account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100 sm:px-10">

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:bg-white transition-all relative z-20"
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative group">
                                <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:bg-white transition-all relative z-20"
                                />
                            </div>
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
                                disabled={loading || newPassword.length < 6}
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-white bg-agro-600 hover:bg-agro-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agro-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
