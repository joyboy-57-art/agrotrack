import React, { useState } from 'react';
import { Menu, Search, Bell, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useLocation } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const { notifications, unreadCount, loading, markAsRead, refreshNotifications } = useNotifications();
    const [showNotifs, setShowNotifs] = useState(false);
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin-dashboard' || path === '/farmer-dashboard') return 'Dashboard';
        if (path === '/marketplace') return 'Marketplace';
        if (path === '/my-bookings') return 'My Bookings';
        if (path.includes('equipment-management')) return 'Equipment Management';
        if (path.includes('order-confirmation')) return 'Order Confirmation';
        if (path === '/admin/users') return 'User Management';
        if (path === '/admin/payments') return 'Payments';
        if (path === '/profile') return 'My Profile';
        return 'Overview';
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="p-2 mr-4 text-gray-500 hover:bg-gray-50 rounded-xl lg:hidden transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">{getPageTitle()}</h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Welcome back, {user?.name}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search - Hidden on tiny screens */}
                <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 w-64 transition-all focus-within:ring-2 focus-within:ring-agro-100 focus-within:border-agro-500 group">
                    <Search className="w-4 h-4 text-gray-400 group-focus-within:text-agro-600" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="bg-transparent border-none text-sm ml-2 focus:ring-0 w-full text-gray-600 placeholder:text-gray-400"
                    />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="p-2 text-gray-500 hover:bg-agro-50 hover:text-agro-600 rounded-xl transition-all relative"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifs && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] font-bold text-agro-600 bg-agro-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">Loading...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No notifications</div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => !notif.is_read && markAsRead(notif.id)}
                                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-agro-50/20' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.is_read ? 'bg-agro-500' : 'bg-transparent'}`}></div>
                                                    <div>
                                                        <p className={`text-xs leading-relaxed ${!notif.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                                            {notif.message}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 font-bold mt-1 block">
                                                            {new Date(notif.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t border-gray-50 bg-gray-50/50 text-center">
                                <button
                                    onClick={refreshNotifications}
                                    className="text-[10px] font-black text-gray-400 hover:text-agro-600 uppercase tracking-widest transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-100"></div>

                {/* Profile Toggle */}
                <div className="flex items-center space-x-3 pl-2 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{user?.role === 'admin' ? 'Administrator' : 'Farmer'}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-agro-600 transition-colors" />
                </div>
            </div>
        </header>
    );
};

export default Header;
