import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { ShieldCheck, CheckCircle, X, Loader2 } from 'lucide-react';
import paymentService from '../services/paymentService';

/**
 * PaymentQR
 * Full-screen modal that shows a UPI QR code and lets the user confirm payment.
 *
 * Props:
 *   booking       – the booking object returned by createBooking (must have .id, .total_cost)
 *   paymentIntent – the response from createPayment (must have .payment_id, .upiLink)
 *   amount        – total amount in INR (number)
 *   equipmentName – display name of the rented equipment (string)
 *   onSuccess     – called after payment is verified successfully
 *   onCancel      – called when the user cancels / closes the modal
 */
const PaymentQR = ({
    booking,
    paymentIntent,
    amount,
    equipmentName,
    onSuccess,
    onCancel,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    // Build the UPI deep-link; prefer the one returned by the server
    const upiLink =
        paymentIntent?.upiLink ||
        `upi://pay?pa=agrotrack@upi&pn=AgroTrack%20Rental&am=${amount}&tn=Booking${booking?.id}&cu=INR`;

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        try {
            await paymentService.verifyPayment({
                payment_id: paymentIntent?.payment_id,
                booking_id: booking?.id,
                status: 'success',
            });
            setConfirmed(true);
            // Give the user a moment to see the success screen, then navigate
            setTimeout(() => onSuccess(), 1800);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Payment verification failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        // Best-effort: mark payment failed so the booking can be cleaned up
        try {
            if (paymentIntent?.payment_id) {
                await paymentService.verifyPayment({
                    payment_id: paymentIntent.payment_id,
                    booking_id: booking?.id,
                    status: 'failed',
                });
            }
        } catch {
            // Swallow — we're cancelling anyway
        }
        onCancel();
    };

    return (
        /* Overlay */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

                {/* ─── Success Screen ─── */}
                {confirmed ? (
                    <div className="flex flex-col items-center justify-center p-10 gap-4 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Payment Confirmed!</h2>
                        <p className="text-gray-500 font-medium">
                            Your booking for{' '}
                            <span className="font-bold text-gray-800">{equipmentName}</span>{' '}
                            has been confirmed.
                        </p>
                        <p className="text-xs text-gray-400">Redirecting to your dashboard…</p>
                    </div>
                ) : (
                    <>
                        {/* ─── Header ─── */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Pay via UPI</h2>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">
                                    Scan the QR code with any UPI app
                                </p>
                            </div>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                aria-label="Close payment modal"
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors disabled:opacity-40"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ─── Booking Summary ─── */}
                        <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-0.5">
                                    Equipment
                                </p>
                                <p className="font-bold text-gray-900 text-sm">{equipmentName}</p>
                                {booking?.id && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Booking ID: #{booking.id}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-0.5">
                                    Amount
                                </p>
                                <p className="text-2xl font-black text-emerald-600">₹{amount}</p>
                            </div>
                        </div>

                        {/* ─── QR Code ─── */}
                        <div className="flex flex-col items-center px-6 py-8 gap-4">
                            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm inline-block">
                                <QRCode
                                    value={upiLink}
                                    size={190}
                                    bgColor="#ffffff"
                                    fgColor="#1a1a1a"
                                />
                            </div>
                            <p className="text-sm text-gray-500 font-medium text-center">
                                Accepts{' '}
                                <span className="font-bold text-gray-700">
                                    GPay, PhonePe, Paytm & all UPI apps
                                </span>
                            </p>
                        </div>

                        {/* ─── Error ─── */}
                        {error && (
                            <div className="mx-6 mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* ─── Actions ─── */}
                        <div className="flex flex-col gap-3 px-6 pb-6">
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-emerald-200 flex items-center justify-center gap-2 text-base"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying…
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Payment Done – Confirm Booking
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors disabled:opacity-40"
                            >
                                Cancel
                            </button>

                            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-semibold">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Secured by AgroProtect™</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentQR;
