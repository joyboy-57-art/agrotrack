import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Tractor,
    Calendar,
    Settings,
    CheckSquare,
    Users,
    CreditCard,
    User,
    LogOut,
    X,
    ChevronRight,
    ShoppingBag
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils'; // Assuming I'll create this utility or use a simple concat

const SidebarItem = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => cn(
            "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group",
            isActive
                ? "bg-agro-600 text-white shadow-lg shadow-agro-100"
                : "text-gray-500 hover:bg-agro-50 hover:text-agro-600"
        )}
    >
        <Icon className={cn(
            "w-5 h-5 mr-3 transition-colors",
            "group-hover:scale-110 duration-300"
        )} />
        <span className="flex-1">{label}</span>
        <ChevronRight className={cn(
            "w-4 h-4 opacity-0 transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-x-1"
        )} />
    </NavLink>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();

    const adminLinks = [
        { to: "/admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/equipment-management", icon: Settings, label: "Equipment" },
        { to: "/admin/order-confirmation", icon: CheckSquare, label: "Orders" },
        { to: "/admin/users", icon: Users, label: "Users" },
        { to: "/admin/payments", icon: CreditCard, label: "Payments" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    const farmerLinks = [
        { to: "/farmer-dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
        { to: "/my-bookings", icon: Calendar, label: "My Bookings" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    const links = user?.role === 'admin' ? adminLinks : farmerLinks;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="p-6 flex items-center justify-between">
                        <Link to="/" className="flex items-center">
                            <div className="bg-agro-600 p-2 rounded-xl text-white mr-3 shadow-lg shadow-agro-100">
                                <Tractor className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 truncate">
                                Agro<span className="text-agro-600">Track</span>
                            </span>
                        </Link>
                        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                        <div className="px-4 mb-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Main Menu</p>
                        </div>
                        {links.map((link) => (
                            <SidebarItem
                                key={link.to}
                                {...link}
                                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            />
                        ))}
                    </nav>

                    {/* Bottom Area */}
                    <div className="p-4 border-t border-gray-50">
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
