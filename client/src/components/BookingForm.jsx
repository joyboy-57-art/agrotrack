import React, { useState } from 'react';
import { IndianRupee, CalendarDays, Wallet, Smartphone, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService'; // NEW

const BookingForm = ({ equipment, onSuccess }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Payment States
    const [step, setStep] = useState(1); // 1 = Date Selection, 2 = Payment
    const [paymentMethod, setPaymentMethod] = useState('UPI_ID');
    const [upiId, setUpiId] = useState('');
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end.getTime() - start.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
    };

    const days = calculateDays();
    const totalCost = days * equipment.price_per_day;

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if (days <= 0) {
            setError('Please select valid check-in and check-out dates.');
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
            // 1. Create Booking as Pending
            const bookingResult = await bookingService.createBooking({
                equipment_id: equipment.id,
                start_date: startDate,
                end_date: endDate,
                total_cost: totalCost
            });

            // 2. Create Payment Intent
            const paymentIntent = await paymentService.createPayment({
                booking_id: bookingResult.id,
                total_amount: totalCost,
                payment_method: paymentMethod
            });

            // 3. Simulate Successful Verification
            await paymentService.verifyPayment({
                payment_id: paymentIntent.payment_id,
                booking_id: bookingResult.id,
                status: 'success'
            });

            setShowConfirmPopup(false);
            onSuccess(); // Redirect to Dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Payment or Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('UPI_ID')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'UPI_ID' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <Smartphone className="w-6 h-6" />
                            <span className="font-bold text-sm">UPI ID</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('QR_CODE')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'QR_CODE' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <QrCode className="w-6 h-6" />
                            <span className="font-bold text-sm">QR Code</span>
                        </button>
                    </div>

                    {paymentMethod === 'UPI_ID' && (
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Enter UPI ID</label>
                            <input
                                type="text"
                                placeholder="name@bank"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    )}

                    {paymentMethod === 'QR_CODE' && (
                        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 flex flex-col items-center mb-4">
                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-4 inline-block">
                                <QRCode
                                    value={`upi://pay?pa=agrotrack@upi&pn=AgroTrack Rental&am=${totalCost}&cu=INR`}
                                    size={160}
                                />
                            </div>
                            <p className="font-bold text-gray-900">Scan to Pay ₹{totalCost}</p>
                            <p className="text-sm text-gray-500 mt-1">Accepts GPay, PhonePe, Paytm</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="py-4 px-6 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowConfirmPopup(true)}
                        disabled={paymentMethod === 'UPI_ID' && !upiId}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
                    >
                        {`Pay ₹${totalCost}`}
                        <Wallet className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center text-xs text-emerald-700 font-bold bg-emerald-50 py-2 rounded-lg flex items-center justify-center gap-2">
                    <IndianRupee className="w-4 h-4" /> Secure UPI Payment
                </div>

                {/* Confirmation Popup Modal */}
                {showConfirmPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-black text-gray-900 mb-2">Confirm Payment</h3>
                            <p className="text-gray-600 mb-6">Complete the payment in your UPI app and click Confirm Payment.</p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleConfirmBookingAndPay}
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : 'Confirm Payment'}
                                </button>
                                <button
                                    onClick={() => setShowConfirmPopup(false)}
                                    disabled={loading}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleProceedToPayment} className="flex flex-col gap-5">
            {/* SaaS Style Dual Input Row */}
            <div className="flex border rounded-2xl border-gray-300 overflow-hidden divide-x divide-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                <div className="flex-1 p-3">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Check-in</label>
                    <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 p-0 text-sm font-medium"
                    />
                </div>
                <div className="flex-1 p-3">
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">Check-out</label>
                    <input
                        type="date"
                        required
                        min={startDate || new Date().toISOString().split('T')[0]}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 p-0 text-sm font-medium"
                    />
                </div>
            </div>

            {/* Receipt / Calculation Block */}
            {days > 0 ? (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>₹{equipment.price_per_day} x {days} days</span>
                            <span>₹{totalCost}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span className="underline decoration-dotted cursor-help">Service Fee</span>
                            <span>₹0</span>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-xl font-black text-emerald-600">₹{totalCost}</span>
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50 text-emerald-800 text-sm font-medium p-4 rounded-xl flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 shrink-0 mt-0.5" />
                    Enter your dates to see the total rental price.
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={days <= 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md shadow-emerald-200"
            >
                Proceed to Payment
            </button>

            <p className="text-center text-xs text-gray-500 font-medium">You won't be charged yet</p>
        </form>
    );
};

export default BookingForm;
