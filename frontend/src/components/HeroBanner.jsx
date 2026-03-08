import React from 'react';
import { cn } from '../lib/utils';

const HeroBanner = ({ title, description, image, actions }) => {
    return (
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-agro-600 to-agro-800 text-white overflow-hidden mb-8 shadow-2xl shadow-agro-200 group">
            {/* Patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:40px_40px]"></div>
            </div>

            <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center lg:text-left">
                    <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tight">
                        {title}
                    </h2>
                    <p className="text-agro-50 text-lg mb-8 opacity-90 font-medium">
                        {description}
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        {actions && actions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={action.onClick}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 flex items-center shadow-xl",
                                    action.primary
                                        ? "bg-white text-agro-700 hover:bg-agro-50"
                                        : "bg-agro-500/20 backdrop-blur-md text-white border border-agro-400/30 hover:bg-agro-500/30"
                                )}
                            >
                                {action.icon && <action.icon className="w-5 h-5 mr-2" />}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                {image && (
                    <div className="relative w-full lg:w-1/3 aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl group-hover:rotate-2 transition-transform duration-700">
                        <img src={image} alt="Hero" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-agro-900/40 to-transparent"></div>
                    </div>
                )}
            </div>

            {/* Decorative floaters */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-agro-400/20 blur-3xl rounded-full"></div>
        </div>
    );
};

export default HeroBanner;
// Need to add cn import manually in next step or just use simple template
