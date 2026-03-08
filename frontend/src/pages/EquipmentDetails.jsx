import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, ShieldCheck, Zap, Info, IndianRupee, Star, CalendarDays, CheckCircle, ChevronRight } from 'lucide-react';
import equipmentService from '../services/equipmentService';
import BookingDatePicker from '../components/BookingDatePicker';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import { getEquipmentImage, IMAGES } from '../assets/images';

const EquipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await equipmentService.getEquipmentById(id);
                setEquipment(data);
            } catch (err) {
                navigate('/marketplace');
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <SkeletonLoader type="card" count={1} />
        </div>
    );

    if (!equipment) return null;

    const imageUrl = getEquipmentImage(equipment);

    return (
        <div className="bg-white min-h-screen animate-in fade-in duration-700">
            {/* Compact Top Navbar for Navigation */}
            <div className="border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 hover:text-agro-700 text-[10px] font-black uppercase tracking-widest transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Fleet
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Title & Meta Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="badge-premium bg-agro-50 text-agro-600 border-none px-3 py-1 text-[10px] uppercase font-black tracking-widest">
                            {equipment.category}
                        </span>
                        {equipment.availability_status === 'unavailable' && (
                            <span className="badge-premium bg-red-50 text-red-600 border-none px-3 py-1 text-[10px] uppercase font-black tracking-widest">
                                Currently Deployed
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6 italic font-['Outfit']">
                        {equipment.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-2" />
                            <span className="text-gray-900 font-black">4.95</span>
                            <span className="ml-2 text-[10px] uppercase tracking-widest opacity-60">(128 reviews)</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-agro-600" />
                            <span className="uppercase tracking-widest text-[10px] font-black">{equipment.location || 'Pan India Fleet'}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                        <div className="flex items-center text-agro-700 font-black text-[10px] uppercase tracking-widest bg-agro-50 px-3 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3 mr-2" /> Verified Asset
                        </div>
                    </div>
                </div>

                {/* Main Hero Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 h-[350px] md:h-[550px]">
                    <div className="lg:col-span-2 h-full rounded-[2.5rem] overflow-hidden hover:opacity-95 transition-all cursor-pointer shadow-2xl border-4 border-white">
                        <img
                            src={imageUrl}
                            alt={equipment.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = IMAGES.heroOverlay; }}
                        />
                    </div>
                    <div className="hidden lg:flex flex-col gap-6 h-full">
                        <div className="h-1/2 rounded-[2rem] overflow-hidden hover:opacity-95 transition-all cursor-pointer shadow-xl border-4 border-white">
                            <img src={IMAGES.farmer2} alt="Feature 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-1/2 rounded-[2rem] overflow-hidden hover:opacity-95 transition-all cursor-pointer shadow-xl border-4 border-white">
                            <img src={IMAGES.cropField} alt="Feature 2" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Two-Column Details Layout */}
                <div className="lg:grid lg:grid-cols-12 lg:gap-20">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-12">
                        {/* Owner Banner */}
                        <div className="flex items-center justify-between pb-10 border-b border-gray-50">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-agro-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black italic shadow-xl shadow-agro-100 border-4 border-white">
                                    RK
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Rented by Ramesh Kumar</h2>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Fleet Commander · Member since 2023</p>
                                </div>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="card-premium h-auto flex flex-col items-start gap-4 bg-gray-50/50 border-none p-8 hover:translate-y-0 shadow-none">
                                <CalendarDays className="w-10 h-10 text-agro-600" />
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg italic mb-2 tracking-tight">Flexible Cancellation</h3>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">Free operational window adjustments for up to 48 hours. Strategic flexibility guaranteed.</p>
                                </div>
                            </div>
                            <div className="card-premium h-auto flex flex-col items-start gap-4 bg-gray-50/50 border-none p-8 hover:translate-y-0 shadow-none">
                                <CheckCircle className="w-10 h-10 text-agro-600" />
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg italic mb-2 tracking-tight">Prime Maintenance</h3>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">Certified 50-point inspection before every deployment. Zero-downtime philosophy.</p>
                                </div>
                            </div>
                        </div>

                        {/* Full Description */}
                        <div>
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Asset Intelligence</h2>
                            <p className="text-xl font-bold text-gray-700 leading-relaxed italic border-l-4 border-agro-600 pl-8">
                                {equipment.description || `This premium ${equipment.name} is maintained to the highest industrial standards, ensuring maximum efficiency for your agricultural operations. Ideal for both precision small-scale work and high-output industrial farming.`}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Booking Widget Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4 mt-16 lg:mt-0 relative">
                        <div className="sticky top-28 card-premium bg-white p-10 border-gray-100 shadow-2xl">
                            <div className="flex items-baseline justify-between mb-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-gray-900 italic">
                                        ₹{equipment.price_per_day}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/ Operational Day</span>
                                </div>
                            </div>

                            {equipment.availability_status === 'unavailable' ? (
                                <div className="bg-red-50 text-red-700 font-black p-8 rounded-3xl flex flex-col items-center justify-center border-2 border-red-100 text-center">
                                    <Zap className="w-8 h-8 mb-4 opacity-50" />
                                    <span className="text-lg uppercase tracking-widest">Asset Active</span>
                                    <span className="text-[10px] font-bold opacity-60 mt-2 uppercase tracking-widest italic">Currently deployed in field</span>
                                </div>
                            ) : user ? (
                                <BookingDatePicker equipment={equipment} onSuccess={() => navigate('/farmer-dashboard')} />
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-agro-50/50 rounded-2xl p-6 border border-agro-100 flex items-start gap-4">
                                        <Info className="w-6 h-6 text-agro-600 shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold text-agro-800 leading-relaxed">Authorization required to access the operational calendar and secure this unit.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="btn-primary w-full py-5 shadow-xl shadow-agro-100"
                                    >
                                        Authorize & Access
                                    </button>
                                </div>
                            )}

                            {/* Trust signals */}
                            <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col gap-6">
                                <div className="flex items-center text-gray-400 gap-3 justify-center">
                                    <CheckCircle className="w-4 h-4 text-agro-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetails;
