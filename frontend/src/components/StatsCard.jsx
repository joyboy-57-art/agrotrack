import React from 'react';
import { cn } from '../lib/utils';

const StatsCard = ({ title, value, icon: Icon, trend, color = "agro" }) => {
    const colorClasses = {
        agro: "bg-agro-50 text-agro-600 shadow-agro-100",
        blue: "bg-blue-50 text-blue-600 shadow-blue-100",
        purple: "bg-purple-50 text-purple-600 shadow-purple-100",
        orange: "bg-orange-50 text-orange-600 shadow-orange-100",
        red: "bg-red-50 text-red-600 shadow-red-100",
    };

    return (
        <div className="card-premium p-6 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-gray-900 group-hover:scale-110 transition-transform duration-500 origin-left">
                        {value}
                    </h3>

                    {trend && (
                        <div className={cn(
                            "mt-4 flex items-center text-xs font-bold px-2 py-1 rounded-full w-fit",
                            trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>
                            <span>{trend.isUp ? '↑' : '↓'} {trend.value}%</span>
                            <span className="ml-1 text-gray-400 font-normal">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={cn(
                    "p-4 rounded-2xl shadow-lg transition-all duration-500 group-hover:rotate-12",
                    colorClasses[color] || colorClasses.agro
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {/* Soft decorative glow on hover */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-current opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10 pointer-events-none"></div>
        </div>
    );
};

export default StatsCard;
