import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import bookingService from '../services/bookingService';

/**
 * BookingDatePicker
 * Handles date selection, price calculation, and booking creation.
 * On success, calls `onBookingCreated(booking)` with the new booking object.
 */
const BookingDatePicker = ({ equipment, onBookingCreated }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    // Calculate rental days from selected dates
    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end.getTime() - start.getTime();
        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    };

    const days = calculateDays();
    const totalCost = days * (equipment?.price_per_day ?? 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (days <= 0) {
            setError('Please select a valid check-in and check-out date.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const booking = await bookingService.createBooking({
                equipment_id: equipment.id,
                start_date: startDate,
                end_date: endDate,
                total_cost: totalCost,
            });
            // Pass the created booking up — parent will open the payment modal
            onBookingCreated(booking);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to create booking. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Date range picker — check-in / check-out */}
            <div className="flex border rounded-2xl border-gray-300 overflow-hidden divide-x divide-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                <div className="flex-1 p-3">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">
                        Check-in
                    </label>
                    <input
                        type="date"
                        required
                        min={today}
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            // Reset end date if it's now before start date
                            if (endDate && e.target.value > endDate) setEndDate('');
                        }}
                        className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 p-0 text-sm font-medium"
                    />
                </div>
                <div className="flex-1 p-3">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">
                        Check-out
                    </label>
                    <input
                        type="date"
                        required
                        min={startDate || today}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 p-0 text-sm font-medium"
                    />
                </div>
            </div>

            {/* Price breakdown — shown only after valid dates are selected */}
            {days > 0 ? (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>
                                ₹{equipment.price_per_day} × {days} day{days !== 1 ? 's' : ''}
                            </span>
                            <span>₹{totalCost}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span className="underline decoration-dotted cursor-help">
                                Service fee
                            </span>
                            <span>₹0</span>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-xl font-black text-emerald-600">
                            ₹{totalCost}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50 text-emerald-800 text-sm font-medium p-4 rounded-xl flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 shrink-0 mt-0.5" />
                    Select your dates to see the total rental price.
                </div>
            )}

            {/* Inline error message */}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            {/* CTA */}
            <button
                type="submit"
                disabled={days <= 0 || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating booking…
                    </>
                ) : (
                    'Proceed to Payment'
                )}
            </button>

            <p className="text-center text-xs text-gray-500 font-medium">
                You won't be charged until you confirm payment
            </p>
        </form>
    );
};

export default BookingDatePicker;
