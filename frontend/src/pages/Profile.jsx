import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, ShieldCheck, CheckCircle, AlertCircle, Save, X, Lock, Key } from 'lucide-react';
import api from '../services/api';
import { Skeleton } from '../components/SkeletonLoader';
import HeroBanner from '../components/HeroBanner';
import { cn } from '../lib/utils';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_number: '',
        changePassword: false,
        oldPassword: '',
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setFormData(prev => ({
                    ...prev,
                    name: res.data.name || '',
                    email: res.data.email || '',
                    mobile_number: res.data.mobile_number || '',
                }));
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        if (formData.changePassword) {
            if (!formData.oldPassword) {
                setMessage({ type: 'error', text: 'Old password is required.' });
                setSaving(false);
                return;
            }
            if (formData.password.length < 6) {
                setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
                setSaving(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'New passwords do not match.' });
                setSaving(false);
                return;
            }
        }

        try {
            const updatePayload = {
                userId: user.id,
                name: formData.name,
                email: formData.email,
                mobile_number: formData.mobile_number,
                changePassword: formData.changePassword
            };

            if (formData.changePassword) {
                updatePayload.oldPassword = formData.oldPassword;
                updatePayload.newPassword = formData.password;
            }

            const res = await api.put('/users/profile', updatePayload);
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setIsEditing(false);

            setFormData(prev => ({
                ...prev,
                changePassword: false,
                oldPassword: '',
                password: '',
                confirmPassword: ''
            }));

            const updatedUserContext = {
                ...user,
                name: res.data.user.name,
                email: res.data.user.email,
                mobile_number: res.data.user.mobile_number
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserContext));
            // Assuming login() updates the context state
            if (login) login(updatedUserContext);

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="animate-in fade-in duration-700">
            <Skeleton className="h-64 w-full mb-12" />
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="card-premium-static p-8">
                    <div className="flex items-center gap-6 mb-12">
                        <Skeleton className="h-24 w-24 rounded-3xl" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <HeroBanner
                title="Account Settings"
                description="Manage your personal information, security preferences, and account status."
                actions={[]}
            />

            <div className="max-w-4xl mx-auto -mt-12 relative z-10 px-4">
                <div className="card-premium-static bg-white shadow-2xl shadow-agro-900/5 mb-20">

                    {/* Status Message */}
                    {message.text && (
                        <div className={cn(
                            "p-6 flex items-center gap-4 animate-in slide-in-from-top-4 duration-300",
                            message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        )}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="font-bold text-sm">{message.text}</span>
                        </div>
                    )}

                    <div className="p-8 lg:p-12">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12 pb-12 border-b border-gray-50">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-[2rem] bg-agro-50 text-agro-600 flex items-center justify-center text-4xl font-black border-4 border-white shadow-xl ring-1 ring-agro-100 italic">
                                    {formData.name.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-gray-900 font-['Outfit']">{formData.name}</h2>
                                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <ShieldCheck className="w-3 h-3 mr-1.5 text-agro-600" />
                                        {user.role} Member
                                    </div>
                                </div>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-secondary w-full sm:w-auto"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-agro-600 transition-colors" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input-premium pl-16"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-agro-600 transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input-premium pl-16 cursor-not-allowed opacity-70"
                                            placeholder="email@example.com"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Connectivity</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-agro-600 transition-colors" />
                                        <input
                                            type="text"
                                            name="mobile_number"
                                            value={formData.mobile_number}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input-premium pl-16"
                                            placeholder="+91 00000 00000"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            {isEditing && (
                                <div className="pt-10 border-t border-gray-50 space-y-8 animate-in fade-in duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-agro-50 p-2 rounded-xl">
                                            <Lock className="w-5 h-5 text-agro-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 font-['Outfit'] italic">Shield Credentials</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Update your security pass</p>
                                        </div>
                                        <div className="ml-auto">
                                            <input
                                                type="checkbox"
                                                id="changePassword"
                                                name="changePassword"
                                                checked={formData.changePassword}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded-lg border-2 border-gray-100 text-agro-600 focus:ring-agro-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {formData.changePassword && (
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 animate-in slide-in-from-top-4 duration-500">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                                <div className="relative group">
                                                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        name="oldPassword"
                                                        value={formData.oldPassword}
                                                        onChange={handleChange}
                                                        className="input-premium pl-14 bg-white"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Passcode</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="input-premium bg-white"
                                                        placeholder="New password"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Verify Passcode</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="input-premium bg-white"
                                                        placeholder="Repeat new password"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isEditing && (
                                <div className="pt-10 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="btn-ghost"
                                    >
                                        <X className="w-5 h-5 mr-2" /> Discard
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn-primary min-w-[200px]"
                                    >
                                        {saving ? "Deploying..." : <><Save className="w-5 h-5 mr-3" /> Save Changes</>}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
