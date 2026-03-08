import React, { useState } from 'react';
import { IndianRupee, CalendarDays, Wallet, Smartphone, QrCode, CheckCircle, ShieldCheck } from 'lucide-react';
import QRCode from 'react-qr-code';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import { cn } from '../lib/utils';

const BookingForm = ({ equipment, onSuccess }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('UPI_ID');
    const [upiId, setUpiId] = useState('');
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end.getTime() - start.getTime();
        const daysCount = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
        return Math.max(0, daysCount);
    };

    const days = calculateDays();
    const totalCost = days * (equipment?.price_per_day || 0);

    const handleStartDateChange = (val) => {
        setStartDate(val);
        // If start date is now after end date, reset end date to maintain validity
        if (endDate && val > endDate) {
            setEndDate('');
        }
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if (days <= 0) {
            setError('Operational window mismatch detected. Ensure the termination date follows the commencement date.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleConfirmBookingAndPay = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const bookingResult = await bookingService.createBooking({
                equipment_id: equipment.id,
                start_date: startDate,
                end_date: endDate,
                total_cost: totalCost
            });

            await paymentService.createPayment({
                booking_id: bookingResult.id,
                total_amount: totalCost,
                payment_method: paymentMethod
            });

            await paymentService.verifyPayment({
                payment_id: bookingResult.id,
                booking_id: bookingResult.id,
                status: 'success'
            });

            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction authorization failed.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Protocol</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('UPI_ID')}
                            className={cn(
                                "p-6 rounded-2xl border transition-all flex flex-col items-center gap-3",
                                paymentMethod === 'UPI_ID'
                                    ? "bg-agro-600 border-agro-600 text-white shadow-lg shadow-agro-100"
                                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                            )}
                        >
                            <Smartphone className="w-6 h-6" />
                            <span className="font-black text-[10px] uppercase tracking-widest">Unified UPI</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('QR_CODE')}
                            className={cn(
                                "p-6 rounded-2xl border transition-all flex flex-col items-center gap-3",
                                paymentMethod === 'QR_CODE'
                                    ? "bg-agro-600 border-agro-600 text-white shadow-lg shadow-agro-100"
                                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                            )}
                        >
                            <QrCode className="w-6 h-6" />
                            <span className="font-black text-[10px] uppercase tracking-widest">Instant QR</span>
                        </button>
                    </div>

                    {paymentMethod === 'UPI_ID' && (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Virtual Payment Address</label>
                            <input
                                type="text"
                                placeholder="vpa@bank"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="input-premium py-4"
                            />
                        </div>
                    )}

                    {paymentMethod === 'QR_CODE' && (
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col items-center">
                            <div className="bg-white p-4 rounded-2xl shadow-xl border border-white mb-6">
                                <QRCode
                                    value={`upi://pay?pa=agrotrack@upi&pn=AgroTrack%20Fleet&am=${totalCost}&cu=INR`}
                                    size={140}
                                    fgColor="#166534"
                                />
                            </div>
                            <p className="text-sm font-black text-gray-900 tracking-tight">Scanner Ready: ₹{totalCost}</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-secondary py-4 px-8"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowConfirmPopup(true)}
                        disabled={paymentMethod === 'UPI_ID' && !upiId}
                        className="flex-1 btn-primary py-4 shadow-xl shadow-agro-100"
                    >
                        Execute Order
                    </button>
                </div>

                {showConfirmPopup && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-white animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-agro-50 rounded-2xl flex items-center justify-center text-agro-600 mb-8">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 italic">Verify Completion</h3>
                            <p className="text-gray-500 mb-10 font-medium">Please finalize the payment on your mobile device. Once the funds are released, click confirm to authorize the asset.</p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleConfirmBookingAndPay}
                                    disabled={loading}
                                    className="w-full btn-primary py-4"
                                >
                                    {loading ? 'Authorizing...' : 'Payment Confirmed'}
                                </button>
                                <button
                                    onClick={() => setShowConfirmPopup(false)}
                                    disabled={loading}
                                    className="w-full btn-secondary py-4"
                                >
                                    Abort Process
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleProceedToPayment} className="space-y-8 animate-in slide-in-from-left-4 duration-500">
            <div className="flex flex-col sm:flex-row border rounded-3xl border-gray-100 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-100 bg-gray-50/50">
                <div className="flex-1 p-6 hover:bg-white transition-colors cursor-pointer group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 group-hover:text-agro-600 transition-colors">Commencement</label>
                    <input
                        type="date"
                        required
                        id="startDate"
                        name="startDate"
                        min={new Date().toISOString().split('T')[0]}
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-1 text-gray-900 font-bold cursor-pointer"
                    />
                </div>
                <div className="flex-1 p-6 hover:bg-white transition-colors cursor-pointer group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 group-hover:text-agro-600 transition-colors">Termination</label>
                    <input
                        type="date"
                        required
                        id="endDate"
                        name="endDate"
                        min={startDate || new Date().toISOString().split('T')[0]}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-1 text-gray-900 font-bold cursor-pointer"
                    />
                </div>
            </div>

            {days > 0 ? (
                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 italic">
                        <span>Base Fleet Rate ({days}d)</span>
                        <span className="text-gray-900">₹{totalCost}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 italic">
                        <span>Operational Insurance</span>
                        <span className="text-agro-600">INCLUDED</span>
                    </div>
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Total Commitment</span>
                        <span className="text-3xl font-black text-agro-600 italic">₹{totalCost}</span>
                    </div>
                </div>
            ) : (
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4">
                    <CalendarDays className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-orange-800 leading-relaxed">Determine your operational window to reveal the logistics investment.</p>
                </div>
            )}

            <button
                type="submit"
                disabled={days <= 0}
                className="w-full btn-primary py-5 shadow-2xl shadow-agro-100 uppercase tracking-widest text-xs"
            >
                Lock Dates & Proceed
            </button>
        </form>
    );
};

export default BookingForm;
