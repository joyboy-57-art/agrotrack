import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import equipmentService from '../services/equipmentService';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import { getEquipmentImage } from '../assets/images';

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
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) return <Loader fullPage />;
    if (!equipment) return null;

    const imageUrl = getEquipmentImage(equipment);

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-gray-600 hover:text-emerald-700 text-sm font-bold transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </button>
                    <h1 className="ml-6 text-xl font-bold text-gray-900">Request to book</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-col-reverse md:flex-row">

                    {/* Left Side: Form */}
                    <div className="md:col-span-7 space-y-8">
                        <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select your dates</h2>
                            <BookingForm
                                equipment={equipment}
                                onSuccess={() => navigate('/farmer-dashboard')}
                            />
                        </section>

                        <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ground rules</h2>
                            <p className="text-gray-600 mb-4">We ask every renter to remember a few simple things about what makes a great farm partner.</p>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2 font-medium">
                                <li>Follow the owner's operational guidelines</li>
                                <li>Return the equipment reasonably clean</li>
                                <li>Report any damages immediately</li>
                            </ul>
                        </section>
                    </div>

                    {/* Right Side: Equipment Summary */}
                    <div className="md:col-span-5">
                        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-24">
                            <div className="flex gap-4 items-start mb-6 pb-6 border-b border-gray-100">
                                <img
                                    src={imageUrl}
                                    alt={equipment.name}
                                    className="w-24 h-20 object-cover rounded-xl"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{equipment.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{equipment.category}</p>
                                    <div className="flex items-center text-xs font-bold text-gray-700">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {equipment.location || 'India'}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">Price details</h4>
                                <div className="flex items-baseline gap-1 text-gray-800">
                                    <span className="text-2xl font-black">₹{equipment.price_per_day}</span>
                                    <span className="font-medium">/ night</span>
                                </div>
                            </div>

                            <div className="bg-emerald-50 rounded-xl p-4 flex gap-3 text-emerald-800">
                                <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm">Protected by AgroProtect</h4>
                                    <p className="text-xs font-medium mt-1">Your booking is covered for peace of mind.</p>
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
