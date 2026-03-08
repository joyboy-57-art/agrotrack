import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { addDays, format, differenceInDays, isBefore, startOfToday } from 'date-fns';
import { CalendarDays, IndianRupee, ShieldCheck, Zap, Info } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import bookingService from '../services/bookingService';
import { cn } from '../lib/utils';

const BookingDatePicker = ({ equipment, onSuccess }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [days, setDays] = useState(0);

    const pricePerDay = equipment?.price_per_day || 0;

    useEffect(() => {
        if (startDate && endDate) {
            const calculatedDays = differenceInDays(endDate, startDate) + 1;
            setDays(calculatedDays);
            setTotalPrice(calculatedDays * pricePerDay);
        } else {
            setDays(0);
            setTotalPrice(0);
        }
    }, [startDate, endDate, pricePerDay]);

    const handleBooking = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        setError('');
        try {
            const payload = {
                equipment_id: equipment.id,
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
                total_cost: totalPrice
            };

            await bookingService.createBooking(payload);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Range Picker Container */}
            <div className="border rounded-2xl border-gray-100 overflow-hidden bg-gray-50/50">
                <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation Window</span>
                    <CalendarDays className="w-4 h-4 text-agro-600" />
                </div>

                <div className="p-2">
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => setDateRange(update)}
                        minDate={startOfToday()}
                        monthsShown={1}
                        inline
                        className="w-full"
                        calendarClassName="agro-datepicker"
                        dayClassName={(date) =>
                            isBefore(date, startOfToday()) ? "text-gray-300" : "text-gray-700 font-medium"
                        }
                    />
                </div>
            </div>

            {/* Selected Dates Summary */}
            <div className="grid grid-cols-2 gap-2">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Commencement</p>
                    <p className="text-sm font-bold text-gray-900">
                        {startDate ? format(startDate, 'MMM dd, yyyy') : 'Select Date'}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Termination</p>
                    <p className="text-sm font-bold text-gray-900">
                        {endDate ? format(endDate, 'MMM dd, yyyy') : 'Select Date'}
                    </p>
                </div>
            </div>

            {/* Price Calculation Box */}
            {days > 0 ? (
                <div className="p-6 bg-agro-50/50 rounded-3xl border border-agro-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-600 italic">
                        <span>Fleet Rate ({days} days)</span>
                        <span className="text-gray-900">₹{pricePerDay} × {days}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-600 italic">
                        <span>Protocol Insurance</span>
                        <span className="text-agro-600">INCLUDED</span>
                    </div>
                    <div className="pt-4 border-t border-agro-100 flex justify-between items-center">
                        <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Total Commitment</span>
                        <span className="text-2xl font-black text-agro-600 italic">₹{totalPrice}</span>
                    </div>
                </div>
            ) : (
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4">
                    <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-orange-800 leading-relaxed">Select your operational timeline on the calendar to reveal the logistics investment.</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">
                    {error}
                </div>
            )}

            <button
                onClick={handleBooking}
                disabled={!startDate || !endDate || loading}
                className={cn(
                    "w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl",
                    (!startDate || !endDate || loading)
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-agro-600 text-white hover:bg-agro-700 shadow-agro-100 hover:scale-[1.02] active:scale-[0.98]"
                )}
            >
                {loading ? 'Authorizing...' : 'Lock Dates & Proceed'}
            </button>

            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                No immediate charges until deployment
            </p>
        </div>
    );
};

export default BookingDatePicker;
