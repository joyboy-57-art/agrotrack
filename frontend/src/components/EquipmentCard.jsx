import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Star, ArrowRight, Tag, IndianRupee } from 'lucide-react';
import { getEquipmentImage } from '../assets/images';
import { cn } from '../lib/utils';

const EquipmentCard = ({ equipment }) => {
    const navigate = useNavigate();
    const {
        id,
        name,
        category,
        description,
        price_per_day,
        availability_status,
        owner_name,
        location
    } = equipment;

    const isAvailable = availability_status === 'available';
    const imageUrl = getEquipmentImage(equipment);

    return (
        <div className="card-premium group flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Image Section */}
            <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={cn(
                        "badge-premium shadow-sm border border-white/20 backdrop-blur-md",
                        isAvailable ? "bg-agro-500 text-white" : "bg-red-500 text-white"
                    )}>
                        {isAvailable ? 'Available' : 'Rented'}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4">
                    <span className="badge-premium bg-white/90 text-gray-900 backdrop-blur-md border border-white/50 shadow-sm flex items-center">
                        <Tag className="w-3 h-3 mr-1 text-agro-600" /> {category}
                    </span>
                </div>

                <div className="absolute top-4 right-4">
                    <div className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-amber-500 border border-white/50 shadow-sm flex items-center text-xs font-bold">
                        <Star className="w-3.5 h-3.5 mr-1 fill-current" /> 4.8
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-black text-gray-900 line-clamp-1 group-hover:text-agro-600 transition-colors mb-2 font-['Outfit']">
                    {name}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                    {description || "High-performance agricultural machinery for modern farming needs."}
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <MapPin className="w-4 h-4 mr-2 text-agro-500" />
                        {location || 'India'}
                    </div>
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />
                        Verified Asset
                    </div>
                </div>

                <div className="pt-5 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Rate</p>
                        <div className="flex items-center text-agro-600 font-black">
                            <IndianRupee className="w-4 h-4 mr-0.5" />
                            <span className="text-2xl">{price_per_day}</span>
                            <span className="text-[10px] text-gray-400 font-bold ml-1">/DAY</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/equipment/${id}`)}
                        className={cn(
                            "p-3 rounded-2xl transition-all duration-300 transform active:scale-90",
                            isAvailable
                                ? "bg-agro-600 text-white hover:bg-agro-700 shadow-lg shadow-agro-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Owner hint */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-xl bg-agro-100 text-agro-700 flex items-center justify-center text-xs font-bold mr-3 border border-white shadow-sm">
                        {owner_name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 leading-tight">{owner_name || 'Agro Partner'}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Certified Owner</span>
                    </div>
                </div>
                {isAvailable && (
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-agro-500 animate-pulse mr-2"></div>
                        <span className="text-[10px] font-bold text-agro-600 uppercase">Live</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentCard;
