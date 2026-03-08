import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Tractor, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    let navLinks = [];

    if (!user) {
        navLinks = [
            { name: 'Home', path: '/' },
            { name: 'Marketplace', path: '/marketplace' }
        ];
    } else if (user.role === 'admin') {
        navLinks = [
            { name: 'Dashboard', path: '/admin-dashboard' },
            { name: 'Equipment Management', path: '/admin/equipment-management' },
            { name: 'Order Confirmation', path: '/admin/order-confirmation' },
            { name: 'Users', path: '/admin/users' },
            { name: 'Payments', path: '/admin/payments' },
        ];
    } else {
        navLinks = [
            { name: 'Dashboard', path: '/farmer-dashboard' },
            { name: 'Marketplace', path: '/marketplace' },
            { name: 'My Bookings', path: '/my-bookings' },
        ];
    }

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? (user.role === 'admin' ? '/admin-dashboard' : '/farmer-dashboard') : '/'} className="flex items-center">
                            <Tractor className="h-8 w-8 text-agro-600 mr-2" />
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Agro<span className="text-agro-600">Track</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-semibold transition-colors ${isActive ? 'text-agro-600' : 'text-gray-500 hover:text-agro-600'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-agro-600 transition-colors flex items-center">
                                    <User className="w-4 h-4 mr-1" /> {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-agro-600">Login</Link>
                                <Link to="/register" className="btn-primary px-4 py-2">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-b border-gray-100">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 text-base font-medium ${isActive ? 'bg-agro-50 text-agro-600' : 'text-gray-500'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                    {user ? (
                        <div className="pt-4 pb-3 border-t border-gray-100 px-4 flex justify-between items-center">
                            <Link to="/profile" onClick={() => setIsOpen(false)}>
                                <p className="text-base font-medium text-gray-800 hover:text-agro-600 transition-colors">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </Link>
                            <button onClick={handleLogout} className="text-red-500 font-bold">Logout</button>
                        </div>
                    ) : (
                        <div className="pt-4 pb-3 border-t border-gray-100 px-4 space-y-2">
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center py-2 font-bold text-gray-500">Login</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center py-2 btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
