import React, { useState, useEffect } from 'react';
import { Calendar, Package, Clock, IndianRupee, AlertCircle, ArrowUpRight, Search, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import bookingService from '../services/bookingService';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { formatDate } from '../utils/formatDate';
import { getEquipmentImage } from '../assets/images';
import HeroBanner from '../components/HeroBanner';
import ModernTable from '../components/ModernTable';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

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
                setTimeout(() => setLoading(false), 800);
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
        } finally {
            setActionLoading(false);
            setSelectedBooking(null);
        }
    };

    const columns = [
        {
            key: 'equipment_name',
            label: 'Equipment',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                        <img
                            src={item.image_url || getEquipmentImage({ category: item.category })}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{item.equipment_name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'start_date',
            label: 'Duration',
            render: (item) => (
                <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">{formatDate(item.start_date)}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">to {formatDate(item.end_date)}</p>
                </div>
            )
        },
        {
            key: 'total_cost',
            label: 'Investment',
            sortable: true,
            render: (item) => <span className="font-black text-gray-900 italic">₹{item.total_cost}</span>
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item) => (
                <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    item.status === 'confirmed' ? "bg-blue-50 text-blue-600" :
                        item.status === 'completed' ? "bg-green-50 text-green-600" :
                            item.status === 'rejected' ? "bg-red-50 text-red-600" :
                                item.status === 'cancelled' ? "bg-gray-100 text-gray-500" : "bg-orange-50 text-orange-600"
                )}>
                    {item.status}
                </span>
            )
        },
        {
            key: 'actions',
            label: '',
            render: (item) => (
                <div className="flex items-center justify-end gap-3">
                    <Link to={`/equipment/${item.equipment_id}`} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-agro-600 hover:bg-agro-50 transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </Link>
                    {(item.status === 'pending' || item.status === 'confirmed') && (
                        <button
                            onClick={() => handleCancelRequest(item)}
                            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            Abort
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="animate-in fade-in duration-700 pb-20">
            <HeroBanner
                title="Management Vault"
                description="Securely track, manage, and monitor all your equipment rentals and logistics in one unified dashboard."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <ModernTable
                    title="Rental Ledger"
                    columns={columns}
                    data={bookings}
                    loading={loading}
                    searchPlaceholder="Search by equipment, category, or status..."
                />
            </div>

            {/* Cancel Modal */}
            {cancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-white animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-8">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-4 italic font-['Outfit']">Abort Booking?</h3>
                        <p className="text-gray-500 mb-10 font-medium">Are you sure you want to terminate this rental agreement? This action is irreversible and the asset will be immediately re-listed.</p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={confirmCancellation}
                                disabled={actionLoading}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-100 uppercase tracking-widest text-xs"
                            >
                                {actionLoading ? 'Processing...' : 'Yes, Confirm Abortion'}
                            </button>
                            <button
                                onClick={() => setCancelModalOpen(false)}
                                disabled={actionLoading}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                            >
                                Negative, Retain
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
