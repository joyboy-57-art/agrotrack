import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Search, ArrowRight, Star, CheckCircle, CalendarDays, Store, TrendingUp, Clock } from 'lucide-react';
import { IMAGES } from '../assets/images';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/marketplace');
        }
    };

    const categories = [
        { label: 'Tractors', icon: '🚜', path: '/marketplace?cat=Tractors' },
        { label: 'Harvesters', icon: '🌾', path: '/marketplace?cat=Harvesters' },
        { label: 'Ploughs', icon: '⛏️', path: '/marketplace?cat=Plough' },
        { label: 'Seeders', icon: '🌱', path: '/marketplace?cat=Seed Drill' },
        { label: 'Irrigation Equipment', icon: '💧', path: '/marketplace?cat=Irrigation' },
        { label: 'Rotavators', icon: '🔄', path: '/marketplace?cat=Rotavator' },
        { label: 'Sprayers', icon: '💨', path: '/marketplace?cat=Sprayer' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            {/* ═══════════════════════════════════════════════════════
                HERO SECTION - SaaS Marketplace Style
            ═══════════════════════════════════════════════════════ */}
            <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gray-900">
                {/* Background Image Setup */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                    style={{ backgroundImage: `url('${IMAGES.heroMain}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-gray-900/90" />

                {/* Hero Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-8 tracking-wide">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Premium Agricultural Rentals
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                        AgroTrack – Farm Equipment<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            Rental Marketplace
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        The easiest way to rent, track, and manage agricultural machinery. Find exactly what your farm needs today.
                    </p>

                    {/* Integrated Search Bar inside Hero */}
                    <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2 mb-10">
                        <div className="flex-1 flex items-center relative pl-4 md:pl-6">
                            <Search className="w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for tractors, harvesters, seeders..."
                                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-lg py-4 px-4 text-gray-800 placeholder-gray-400 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 md:py-3 px-8 rounded-xl md:rounded-full transition-colors text-lg whitespace-nowrap"
                        >
                            Browse Equipment
                        </button>
                    </div>

                    {/* Quick CTA Links */}
                    <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-semibold">
                        <span className="text-gray-400 uppercase tracking-wider">Are you an owner?</span>
                        <Link
                            to="/register"
                            className="text-white hover:text-emerald-400 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all border border-white/20"
                        >
                            List Your Equipment →
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                EQUIPMENT CATEGORIES SECTION (SaaS Cards)
            ═══════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Explore Categories</h2>
                        <p className="text-gray-500 mt-2 text-lg">Browse our comprehensive catalog of verified farm equipment.</p>
                    </div>
                    <Link to="/marketplace" className="hidden md:flex items-center text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                        View All Categories <ArrowRight className="w-5 h-5 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            to={cat.path}
                            className="bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100"
                        >
                            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 block">{cat.icon}</span>
                            <span className="font-bold text-gray-800 group-hover:text-emerald-700 text-sm whitespace-nowrap">{cat.label}</span>
                        </Link>
                    ))}
                </div>
                <Link to="/marketplace" className="md:hidden mt-6 flex justify-center items-center text-emerald-600 font-bold hover:text-emerald-700">
                    View All Categories <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
            </div>

            {/* ═══════════════════════════════════════════════════════
                FEATURE HIGHLIGHTS SECTION (Why AgroTrack)
            ═══════════════════════════════════════════════════════ */}
            <div className="bg-white py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                            Smarter Rentals for Modern Farming
                        </h2>
                        <p className="text-gray-500 text-lg">
                            AgroTrack provides a seamless end-to-end rental experience, saving you time, money, and hassle during peak seasons.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Store className="w-8 h-8 text-emerald-600" />,
                                title: 'Easy Online Booking',
                                desc: 'Browse, compare, and book equipment in minutes from any device. No phone calls needed.'
                            },
                            {
                                icon: <Clock className="w-8 h-8 text-blue-600" />,
                                title: 'Real-Time Availability',
                                desc: 'See instantly if an item is available for your required dates. Avoid double bookings.'
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-indigo-600" />,
                                title: 'Trusted Providers',
                                desc: 'Every equipment owner is verified. Read reviews and ratings from other farmers.'
                            },
                            {
                                icon: <CalendarDays className="w-8 h-8 text-amber-500" />,
                                title: 'Flexible Duration',
                                desc: 'Rent by the day or week. Adjust your booking duration based on weather and field conditions.'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                STATS / TRUST SECTION
            ═══════════════════════════════════════════════════════ */}
            <div className="bg-emerald-900 py-20 relative overflow-hidden">
                {/* Abstract tech shapes for SaaS feel */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-700 rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/3" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-emerald-800">
                        {[
                            { value: '15,000+', label: 'Successful Rentals' },
                            { value: '850+', label: 'Verified Machines' },
                            { value: '50+', label: 'Districts Covered' },
                            { value: '99%', label: 'Uptime Reliability' },
                        ].map((stat, idx) => (
                            <div key={idx} className="pl-0 first:pl-0">
                                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</div>
                                <div className="text-emerald-300 font-semibold text-sm uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
