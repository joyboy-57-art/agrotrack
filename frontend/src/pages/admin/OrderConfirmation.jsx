import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, XCircle, User, Calendar, Tag } from 'lucide-react';
import api from '../../services/api';
import ModernTable from '../../components/ModernTable';
import bookingService from '../../services/bookingService';
import { formatDate } from '../../utils/formatDate';
import { cn } from '../../lib/utils';

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
                setTimeout(() => setLoading(false), 800);
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
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
            sortable: true,
            render: (item) => <span className="font-black text-[10px] text-gray-400 uppercase tracking-tighter">#{item.id}</span>
        },
        {
            key: 'equipment_name',
            label: 'Asset',
            sortable: true,
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{item.equipment_name}</span>
                    <span className="text-[10px] font-black text-agro-600 uppercase tracking-widest">{item.category}</span>
                </div>
            )
        },
        {
            key: 'user_name',
            label: 'Renter',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                        <User className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-gray-700">{item.user_name}</span>
                </div>
            )
        },
        {
            key: 'start_date',
            label: 'Logistics',
            render: (item) => (
                <div className="text-[10px] font-bold text-gray-500 space-y-0.5">
                    <p>{formatDate(item.start_date)}</p>
                    <p className="text-gray-300">↓</p>
                    <p>{formatDate(item.end_date)}</p>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Authorization',
            sortable: true,
            render: (item) => (
                <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    item.status === 'confirmed' ? "bg-green-50 text-green-600" :
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
                <div className="flex justify-end gap-2">
                    {item.status === 'pending' && (
                        <>
                            <button
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                                className="btn-secondary py-2 px-4 text-[10px] bg-green-50 text-green-700 hover:bg-green-100 border-none"
                            >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                            </button>
                            <button
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                className="btn-secondary py-2 px-4 text-[10px] bg-red-50 text-red-700 hover:bg-red-100 border-none"
                            >
                                <XCircle className="w-3.5 h-3.5 mr-1" /> Deny
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight italic font-['Outfit']">Clearance Center</h2>
                <p className="text-gray-500 font-medium">Verify and authorize incoming asset rental requests.</p>
            </div>

            <ModernTable
                title="Pending Operations"
                columns={columns}
                data={bookings || []}
                loading={loading}
                searchPlaceholder="Search by ID, asset, or renter..."
            />
        </div>
    );
};

export default OrderConfirmation;
