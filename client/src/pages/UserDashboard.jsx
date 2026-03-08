import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, Clock, ShieldCheck, IndianRupee, AlertCircle, ArrowUpRight, Search, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import bookingService from '../services/bookingService';
import Loader from '../components/Loader';
import { formatDate } from '../utils/formatDate';
import { IMAGES, getEquipmentImage } from '../assets/images';
import agricultureImage from '../assets/images/agriculture.png';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getUserBookings(user.id);
                setBookings(data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user.id]);

    const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const activeCount = bookings.filter(b => b.status === 'confirmed').length;
    const totalSpent = bookings.reduce((sum, b) => sum + Number(b.total_cost || 0), 0);

    const stats = [
        { label: 'Total Bookings', value: activeBookings.length, icon: <Package className="w-6 h-6" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Active Rentals', value: activeCount, icon: <Clock className="w-6 h-6" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Spent', value: `₹${totalSpent}`, icon: <IndianRupee className="w-6 h-6" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Top Navigation Area */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl border-2 border-white shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
                            <p className="text-gray-500 text-sm font-medium">Welcome back, {user.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/marketplace" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm text-sm">
                            New Rental
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

                {/* SaaS Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className={`w-14 h-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* About AgroTrack Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10 flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-10 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm w-fit mb-6">
                            <ShieldCheck className="w-4 h-4" /> About AgroTrack
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                            Empowering Modern <span className="text-emerald-600">Agriculture</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium">
                            AgroTrack is a farm equipment rental platform that connects farmers with equipment owners. Farmers can browse machinery, book equipment, and manage rentals easily through a simple digital platform.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/marketplace" className="bg-gray-900 hover:bg-black text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm">
                                Explore Equipment
                            </Link>
                            <Link to="/my-bookings" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold px-6 py-3 rounded-xl transition-all shadow-sm">
                                View My Bookings
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 h-80 md:h-auto relative">
                        {/* Tractor Working In Field local image */}
                        <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply z-10" />
                        <img
                            src={agricultureImage}
                            alt="Agriculture Machinery"
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                                e.target.src = "/images/fallback-agriculture.png";
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserDashboard;
