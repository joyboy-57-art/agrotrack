import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/Loader';
import bookingService from '../../services/bookingService';

const OrderConfirmation = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getBookings();
                setBookings(data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (bookingId, newStatus) => {
        setActionLoading(true);
        try {
            await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Status update failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Loader fullPage />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
            <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-gray-100 mt-8 lg:mt-0">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center">
                            <ShoppingCart className="w-6 h-6 mr-3 text-emerald-600" /> Order Confirmation
                        </h3>
                        <p className="text-gray-400 text-sm font-medium">Manage and approve recent booking requests</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="pb-4 font-bold">Booking ID</th>
                                <th className="pb-4 font-bold">Equipment</th>
                                <th className="pb-4 font-bold">Farmer</th>
                                <th className="pb-4 font-bold">Dates</th>
                                <th className="pb-4 font-bold">Status</th>
                                <th className="pb-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500 font-medium">No bookings found in the system.</td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 font-bold text-gray-900">#{booking.id}</td>
                                        <td className="py-4 font-semibold text-gray-800">{booking.equipment_name}</td>
                                        <td className="py-4 text-gray-600">{booking.user_name}</td>
                                        <td className="py-4 text-gray-500">
                                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    booking.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {booking.status === 'pending' && (
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                        className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
