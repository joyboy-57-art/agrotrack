import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin, CheckCircle, Info } from 'lucide-react';
import equipmentService from '../services/equipmentService';
import BookingForm from '../components/BookingForm';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { getEquipmentImage } from '../assets/images';
import { cn } from '../lib/utils';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
        <div className="animate-in fade-in duration-700 pb-20">
            {/* Minimal Sub-Header */}
            <div className="bg-white border-b border-gray-50 flex items-center h-16 sticky top-0 z-50 px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center text-gray-400 hover:text-agro-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Fleet</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight italic font-['Outfit']">Seal the Agreement</h1>
                    <p className="text-gray-500 font-medium">Verify asset availability and finalize your operational window.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Primary Configuration */}
                    <div className="lg:col-span-7 space-y-10">
                        <section className="card-premium p-10 bg-white">
                            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-agro-600" /> Allocation Window
                            </h2>
                            <BookingForm
                                equipment={equipment}
                                onSuccess={() => navigate('/farmer-dashboard')}
                            />
                        </section>

                        <section className="card-premium p-10 bg-gray-50 border-none shadow-none">
                            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3 italic">
                                <Info className="w-5 h-5 text-agro-600" /> Operational Protocol
                            </h2>
                            <div className="space-y-6">
                                <p className="text-sm font-medium text-gray-500 italic uppercase tracking-wider">Engagement Terms:</p>
                                <ul className="space-y-4">
                                    {[
                                        'Strict adherence to manufacturer manuals required',
                                        'Asset must be returned in sanitary condition',
                                        'Instant telemetry reporting for any mechanical fatigue',
                                        'Verified operator mandatory for heavy hydraulics'
                                    ].map((rule, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-agro-400 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                            <span className="text-sm font-bold text-gray-700">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Asset Summary Intelligence */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-6">
                            <div className="card-premium bg-white p-8">
                                <div className="flex gap-6 items-center mb-8 pb-8 border-b border-gray-50">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-gray-50 shadow-inner shrink-0">
                                        <img
                                            src={imageUrl}
                                            alt={equipment.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-xl leading-snug mb-2 italic">{equipment.name}</h3>
                                        <span className="badge-premium bg-agro-50 text-agro-600 border-none px-3 py-1 text-[10px] uppercase font-black tracking-[0.15em]">
                                            {equipment.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location Intelligence</p>
                                        <div className="flex items-center text-sm font-bold text-gray-700">
                                            <MapPin className="w-4 h-4 mr-2 text-agro-600" />
                                            {equipment.location || 'Pan India Fleet'}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Base Pricing</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-gray-900">₹{equipment.price_per_day}</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/ Operational Day</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4">
                                    <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">AgroSecure Plus™</h4>
                                        <p className="text-[11px] font-bold text-blue-700/70 leading-relaxed mt-1">This transaction is encrypted and shielded by our mechanical insurance layer.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
