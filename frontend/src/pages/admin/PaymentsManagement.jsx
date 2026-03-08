import React, { useState, useEffect } from 'react';
import { IndianRupee, CreditCard, Calendar, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import ModernTable from '../../components/ModernTable';
import api from '../../services/api';
import { cn } from '../../lib/utils';
import { formatDate } from '../../utils/formatDate';

const PaymentsManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data } = await api.get('/admin/payments');
                setPayments(data);
            } catch (err) {
                console.error('Error fetching payments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const columns = [
        {
            key: 'payer_name',
            label: 'Transaction Info',
            sortable: true,
            render: (item) => (
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-green-50 mr-4 flex items-center justify-center text-green-600 font-bold border border-green-100">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">{item.payer_name}</span>
                        <span className="text-xs text-gray-400 font-medium">Booking ID: #{item.booking_id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'total_amount',
            label: 'Amount',
            sortable: true,
            render: (item) => (
                <div className="flex items-center font-black text-gray-900">
                    <IndianRupee className="w-3 h-3 mr-0.5" />
                    {item.total_amount.toLocaleString()}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item) => (
                <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold",
                    item.status === 'completed' ? "bg-green-50 text-green-600" :
                        item.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                )}>
                    {item.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                        item.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {item.status}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Processed On',
            sortable: true,
            render: (item) => (
                <div className="flex items-center text-gray-500 font-medium text-sm">
                    <Calendar className="w-4 h-4 mr-2 opacity-50" />
                    {formatDate(item.created_at)}
                </div>
            )
        }
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Revenue Streams</h2>
                    <p className="text-gray-500 font-medium">Verify and track all rental transactions.</p>
                </div>
            </div>

            <ModernTable
                title="Transaction History"
                columns={columns}
                data={payments}
                loading={loading}
                searchPlaceholder="Search by payer, ID, or status..."
            />
        </div>
    );
};

export default PaymentsManagement;
