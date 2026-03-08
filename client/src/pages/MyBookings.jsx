import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, Clock, ShieldCheck, IndianRupee, AlertCircle, ArrowUpRight, Search, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import bookingService from '../services/bookingService';
import Loader from '../components/Loader';
import { formatDate } from '../utils/formatDate';
import { IMAGES, getEquipmentImage } from '../assets/images';

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getUserBookings(user.id);
                setBookings(data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user.id]);

    const handleCancelRequest = (booking) => {
        setSelectedBooking(booking);
        setCancelModalOpen(true);
    };

    const confirmCancellation = async () => {
        if (!selectedBooking) return;
        setActionLoading(true);
        try {
            await bookingService.updateBookingStatus(selectedBooking.id, 'cancelled');
            setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b));
            setCancelModalOpen(false);
        } catch (err) {
            console.error('Failed to cancel booking:', err);
            alert('Cancellation failed. Please try again.');
        } finally {
            setActionLoading(false);
            setSelectedBooking(null);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Top Navigation Area */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Bookings</h1>
                            <p className="text-gray-500 text-sm font-medium">Manage and track your equipment rentals</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/marketplace" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm text-sm">
                            New Rental
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10">
                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <FileText className="w-5 h-5 mr-no-2 text-emerald-600 mr-2" /> All Bookings ({bookings.length})
                        </h2>

                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search rentals..."
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full sm:w-64"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-10"><Loader /></div>
                    ) : bookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Equipment</th>
                                        <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Dates</th>
                                        <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map((booking) => {
                                        const img = booking.image_url || getEquipmentImage({ category: booking.category });
                                        return (
                                            <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-100">
                                                            <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = IMAGES.heroOverlay; }} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">{booking.equipment_name}</p>
                                                            <p className="font-medium text-xs text-gray-500">{booking.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm">
                                                        <p className="font-bold text-gray-700">{formatDate(booking.start_date)}</p>
                                                        <p className="text-xs text-gray-500 flex items-center">
                                                            to {formatDate(booking.end_date)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {booking.status === 'confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                                                        {booking.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link to={`/equipment/${booking.equipment_id}`} className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        </Link>
                                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                            <button
                                                                onClick={() => handleCancelRequest(booking)}
                                                                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No rentals found</h3>
                            <p className="text-gray-500 text-sm mb-6 max-w-xs">You haven't rented any farm equipment yet. Let's get started.</p>
                            <Link to="/marketplace" className="bg-white border border-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm">
                                Explore Marketplace
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {cancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-gray-900 mb-2">Cancel Booking?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone and the equipment will be made available to others.</p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmCancellation}
                                disabled={actionLoading}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                            >
                                {actionLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
                            </button>
                            <button
                                onClick={() => setCancelModalOpen(false)}
                                disabled={actionLoading}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors"
                            >
                                Nevermind
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
