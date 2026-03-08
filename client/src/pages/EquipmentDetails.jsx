import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, ShieldCheck, Zap, Info, IndianRupee, Star, CalendarDays, CheckCircle, ChevronRight } from 'lucide-react';
import equipmentService from '../services/equipmentService';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
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
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) return <Loader fullPage />;
    if (!equipment) return null;

    const imageUrl = getEquipmentImage(equipment);

    return (
        <div className="bg-white min-h-screen">
            {/* Compact Top Navbar for Navigation */}
            <div className="border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link to="/marketplace" className="inline-flex items-center text-gray-600 hover:text-emerald-700 text-sm font-bold transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Equipment
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title & Meta Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                            {equipment.category}
                        </span>
                        {equipment.availability_status === 'Unavailable' && (
                            <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                                Currently Unavailable
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                        {equipment.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                        <div className="flex items-center">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-gray-900 font-bold mr-1">4.95</span>
                            <span className="underline decoration-dotted cursor-pointer hover:text-gray-700">(128 reviews)</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-1" />
                            <span className="underline decoration-dotted cursor-pointer">{equipment.location || 'India'}</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
                            <ShieldCheck className="w-4 h-4 mr-1" /> Super Owner
                        </div>
                    </div>
                </div>

                {/* Main Hero Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 h-[300px] md:h-[450px]">
                    <div className="lg:col-span-2 h-full rounded-l-3xl overflow-hidden hover:opacity-95 transition-opacity cursor-pointer shadow-sm">
                        <img
                            src={imageUrl}
                            alt={equipment.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = IMAGES.heroOverlay; }}
                        />
                    </div>
                    <div className="hidden lg:flex flex-col gap-4 h-full">
                        <div className="h-1/2 rounded-tr-3xl overflow-hidden hover:opacity-95 transition-opacity cursor-pointer shadow-sm">
                            <img src={IMAGES.farmer2} alt="Feature 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-1/2 rounded-br-3xl overflow-hidden hover:opacity-95 transition-opacity cursor-pointer shadow-sm">
                            <img src={IMAGES.cropField} alt="Feature 2" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Two-Column Details Layout */}
                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        {/* Owner Banner */}
                        <div className="flex items-center justify-between pb-8 border-b border-gray-200 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Rented by Ramesh Kumar</h2>
                                <p className="text-gray-500">Member since 2023 · Premium Partner</p>
                            </div>
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xl font-bold border-2 border-white shadow-md">
                                RK
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="grid gap-6 pb-8 border-b border-gray-200 mb-8">
                            <div className="flex gap-4 items-start">
                                <CalendarDays className="w-8 h-8 text-gray-700" />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Flexible cancellation</h3>
                                    <p className="text-gray-500">Free cancellation for 48 hours. Secure the equipment worry-free.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <CheckCircle className="w-8 h-8 text-gray-700" />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Well-maintained</h3>
                                    <p className="text-gray-500">Regularly serviced to ensure maximum uptime in the field.</p>
                                </div>
                            </div>
                        </div>

                        {/* Full Description */}
                        <div className="pb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this equipment</h2>
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                {equipment.description || `This premium ${equipment.name} is maintained to the highest standards, ensuring maximum efficiency for your farm operations. Ideal for both small-scale and large industrial farming needs.`}
                            </p>
                            <button className="font-bold underline decoration-2 text-gray-900 flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                Show more <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Booking Widget Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4 mt-10 lg:mt-0 relative">
                        <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-6 mb-10">

                            <div className="flex items-baseline justify-between mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-gray-900">
                                        ₹{equipment.price_per_day}
                                    </span>
                                    <span className="text-gray-500 font-medium">/ night</span>
                                </div>
                            </div>

                            {equipment.availability_status === 'Unavailable' ? (
                                <div className="bg-red-50 text-red-800 font-bold p-5 rounded-2xl flex flex-col items-center justify-center border-t-4 border-red-500 mb-5 shadow-sm text-center">
                                    <span className="text-lg">Currently Unavailable</span>
                                    <span className="text-sm font-medium opacity-80 mt-1">Check back later for availability</span>
                                </div>
                            ) : user ? (
                                <BookingForm equipment={equipment} onSuccess={() => navigate('/farmer-dashboard')} />
                            ) : (
                                <div>
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 flex items-start gap-4">
                                        <Info className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-gray-700">Please sign in or create an account to view availability calendar and reserve this equipment.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors text-lg"
                                    >
                                        Log in to Check Dates
                                    </button>
                                </div>
                            )}

                            {/* Trust signals */}
                            <div className="mt-6 flex flex-col gap-4">
                                <div className="flex items-center text-sm text-gray-600 border border-gray-200 rounded-lg p-3 justify-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    <span>Covered by <span className="font-bold">AgroProtect™</span></span>
                                </div>
                                <div className="text-center text-xs text-gray-400 max-w-xs mx-auto">
                                    <p>Report this listing if it violates our terms of service.</p>
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
