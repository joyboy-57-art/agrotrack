import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { getEquipmentImage, IMAGES } from '../assets/images';

const EquipmentCard = ({ equipment }) => {
    const navigate = useNavigate();
    const imageUrl = getEquipmentImage(equipment);
    const isAvailable = equipment.availability_status === 'Available';

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
            {/* Image Box */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={equipment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src = IMAGES.heroOverlay; }}
                />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${isAvailable ? 'bg-green-100/90 text-green-700' : 'bg-red-100/90 text-red-700'}`}>
                        {isAvailable ? 'Available Now' : 'Currently Rented'}
                    </span>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="bg-white/95 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1 backdrop-blur-sm">
                        {equipment.category}
                    </span>
                </div>
            </div>

            {/* Content Box */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{equipment.name}</h3>
                </div>

                {/* Specs / Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="truncate">{equipment.location || 'India'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
                        <span>Verified Owner</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                        <span className="font-bold text-gray-700">4.8</span>
                        <span className="text-gray-400 ml-1">(12 reviews)</span>
                    </div>
                </div>

                {/* Pricing & Actions */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex items-baseline text-gray-900">
                        <IndianRupee className="w-4 h-4 text-gray-500" />
                        <span className="text-2xl font-black tracking-tight">{equipment.price_per_day}</span>
                        <span className="text-gray-500 text-sm ml-1">/ day</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                            onClick={() => navigate(`/equipment/${equipment.id}`)}
                            className="w-full bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-semibold py-2.5 px-3 rounded-xl transition-all text-sm text-center"
                        >
                            View Details
                        </button>
                        <button
                            onClick={() => navigate(`/booking/${equipment.id}`)}
                            disabled={!isAvailable}
                            className={`w-full font-bold py-2.5 px-3 rounded-xl transition-all text-sm text-center ${isAvailable ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                            {isAvailable ? 'Book Now' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentCard;
