import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, ShieldCheck, CheckCircle, AlertCircle, Save, X } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const Profile = () => {
    const { user, login } = useAuth(); // We might need to update user context if they change their name
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
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
                const res = await api.get('/user/profile');
                setFormData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    mobile_number: res.data.mobile_number || '',
                    changePassword: false,
                    oldPassword: '',
                    password: '',
                    confirmPassword: ''
                });
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
                setMessage({ type: 'error', text: 'Old password is required to set a new password.' });
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

            const res = await api.put('/user/update-profile', updatePayload);
            setMessage({ type: 'success', text: res.data.message });
            setIsEditing(false);

            // Clear password fields after successful update
            setFormData(prev => ({
                ...prev,
                changePassword: false,
                oldPassword: '',
                password: '',
                confirmPassword: ''
            }));

            // If we use the Auth context deeply, we should technically refresh their token or user object here, 
            // but updating local storage user name helps UI consistency.
            const updatedUserContext = { ...user, name: res.data.user.name, email: res.data.user.email };
            localStorage.setItem('user', JSON.stringify(updatedUserContext));
            // To ensure full sync, a page reload or context force-update might be needed, 
            // but setting it in localStorage is a good fallback.

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-emerald-700 pb-24 pt-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Management</h1>
                    <p className="text-emerald-100 font-medium mt-1">View and update your personal details</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Status Messages */}
                    {message.text && (
                        <div className={`p-4 ${message.type === 'success' ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-red-50 border-b border-red-100'}`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {message.type === 'success' ?
                                        <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" /> :
                                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    }
                                </div>
                                <div className="ml-3">
                                    <h3 className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
                                        {message.text}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        {/* Profile Header Block */}
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-3xl shadow-sm border-2 border-white ring-4 ring-emerald-50">
                                    {formData.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                                    <div className="flex items-center mt-1 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
                                        <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                                    </div>
                                </div>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">

                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`block w-full pl-10 pr-3 py-3 border ${isEditing ? 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white' : 'border-transparent bg-gray-50 text-gray-600'} rounded-xl transition-colors sm:text-sm font-medium`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`block w-full pl-10 pr-3 py-3 border ${isEditing ? 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white' : 'border-transparent bg-gray-50 text-gray-600'} rounded-xl transition-colors sm:text-sm font-medium`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="mobile_number" className="block text-sm font-bold text-gray-700 mb-1">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="mobile_number"
                                            id="mobile_number"
                                            value={formData.mobile_number}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`block w-full pl-10 pr-3 py-3 border ${isEditing ? 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white' : 'border-transparent bg-gray-50 text-gray-600'} rounded-xl transition-colors sm:text-sm font-medium`}
                                            required
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="sm:col-span-2 pt-6 mt-2 border-t border-gray-100">
                                        <div className="flex items-center mb-6">
                                            <input
                                                id="changePassword"
                                                name="changePassword"
                                                type="checkbox"
                                                checked={formData.changePassword}
                                                onChange={handleChange}
                                                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 transition-colors"
                                            />
                                            <label htmlFor="changePassword" className="ml-3 block text-sm font-bold text-gray-900">
                                                Change Password
                                            </label>
                                        </div>

                                        {formData.changePassword && (
                                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="oldPassword" className="block text-sm font-bold text-gray-700 mb-1">
                                                        Old Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="oldPassword"
                                                        id="oldPassword"
                                                        value={formData.oldPassword}
                                                        onChange={handleChange}
                                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm font-medium bg-white"
                                                        placeholder="Enter current password"
                                                        required={formData.changePassword}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm font-medium bg-white"
                                                        placeholder="At least 6 characters"
                                                        required={formData.changePassword}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm font-medium bg-white"
                                                        placeholder="Re-enter new password"
                                                        required={formData.changePassword}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setMessage({ type: '', text: '' });
                                        }}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    >
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:w-auto px-8 py-2.5 bg-emerald-600 border border-transparent text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
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
