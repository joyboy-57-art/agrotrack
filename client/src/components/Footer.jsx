import React from 'react';
import { Tractor } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <Tractor className="h-8 w-8 text-agro-600 mr-2" />
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Agro<span className="text-agro-600">Track</span></span>
                        </div>
                        <p className="text-gray-500 max-w-sm mb-6">
                            Simplifying farm operations with premium equipment rentals and efficient resource management. Join our agricultural community today.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-500 hover:text-agro-600 text-sm">Home</Link></li>
                            <li><Link to="/marketplace" className="text-gray-500 hover:text-agro-600 text-sm">Marketplace</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-500 hover:text-agro-600 text-sm">Contact Us</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-agro-600 text-sm">Help Center</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 mt-12 pt-8 text-center">
                    <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} AgroTrack. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
