import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle, X, Loader2, ShieldCheck, Smartphone, AlertTriangle } from 'lucide-react';
import paymentService from '../services/paymentService';

/**
 * PaymentQR – full-screen modal that:
 *  1. Registers a payment intent (POST /api/payments/create)
 *  2. Shows a UPI QR code the farmer scans with any UPI app
 *  3. On "Payment Done" → calls verifyPayment (status = success) → booking confirmed
 *  4. On "Cancel"        → closes modal, booking stays pending
 */
const PaymentQR = ({ booking, equipment, onSuccess, onCancel }) => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState('');
    const [qrError, setQrError] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const amount = booking?.total_cost ?? 0;
    const bookingId = booking?.id ?? '';

    /* ── UPI deep-link ──────────────────────────────────────────────── */
    const upiLink = paymentInfo?.upiLink ||
        `upi://pay?pa=agrotrack@upi&pn=AgroTrack&am=${amount}&tn=Booking${bookingId}&cu=INR`;

    /* ── Register payment intent on mount ──────────────────────────── */
    useEffect(() => {
        const register = async () => {
            try {
                const data = await paymentService.createPayment({
                    booking_id: bookingId,
                    total_amount: amount,
                    payment_method: 'UPI',
                });
                setPaymentInfo(data);
            } catch (err) {
                // non-fatal – QR still renders from the local UPI link
                console.warn('Payment intent registration failed:', err.message);
            }
        };
        if (bookingId) register();
    }, [bookingId, amount]);

    /* ── Confirm payment ────────────────────────────────────────────── */
    const handleConfirm = async () => {
        setConfirming(true);
        setError('');
        try {
            await paymentService.verifyPayment({
                payment_id: paymentInfo?.payment_id,
                booking_id: bookingId,
                status: 'success',
            });
            setConfirmed(true);
            setTimeout(() => onSuccess?.(), 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not confirm payment. Please try again.');
        } finally {
            setConfirming(false);
        }
    };

    /* ── Success screen ─────────────────────────────────────────────── */
    if (confirmed) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                <div className="bg-white rounded-[2.5rem] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-agro-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-agro-100">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-black italic text-gray-900 mb-3 tracking-tight">Booking Confirmed!</h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Redirecting to your dashboard…</p>
                </div>
            </div>
        );
    }

    /* ── Main payment modal ─────────────────────────────────────────── */
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">

                {/* ── Header ── */}
                <div className="bg-agro-600 px-8 pt-8 pb-6 relative">
                    <button
                        onClick={onCancel}
                        className="absolute top-5 right-5 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Close payment modal"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                    <p className="text-agro-100 text-[10px] font-black uppercase tracking-widest mb-1">Payment Required</p>
                    <h2 className="text-3xl font-black text-white italic tracking-tight">Scan &amp; Pay</h2>
                </div>

                <div className="px-8 py-6 space-y-6">

                    {/* ── Booking summary ── */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Summary</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-600">Equipment</span>
                            <span className="text-sm font-black text-gray-900">{equipment?.name || `#${booking?.equipment_id}`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-600">Booking ID</span>
                            <span className="text-sm font-black text-gray-500">#{bookingId}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                            <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Total Amount</span>
                            <span className="text-2xl font-black text-agro-600 italic">₹{amount}</span>
                        </div>
                    </div>

                    {/* ── QR Code ── */}
                    <div className="flex flex-col items-center gap-4">
                        {qrError ? (
                            <div className="flex flex-col items-center gap-3 text-center py-8 px-4 bg-red-50 rounded-2xl border border-red-100 w-full">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                                <p className="text-sm font-bold text-red-700">Unable to generate payment QR code</p>
                                <p className="text-xs font-medium text-red-500">Please try refreshing or contact support.</p>
                            </div>
                        ) : (
                            <div className="p-5 bg-white rounded-2xl border-2 border-agro-100 shadow-lg">
                                <QRCode
                                    value={upiLink}
                                    size={180}
                                    bgColor="#ffffff"
                                    fgColor="#166534"
                                    level="M"
                                    title={`Pay ₹${amount} for Booking #${bookingId}`}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-gray-400">
                            <Smartphone className="w-4 h-4 text-agro-600" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Scan with any UPI app</p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold text-center leading-relaxed">
                            Open PhonePe, Google Pay, Paytm or any UPI app &rarr; Scan QR &rarr; Confirm ₹{amount}
                        </p>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* ── Actions ── */}
                    <div className="space-y-3">
                        <button
                            onClick={handleConfirm}
                            disabled={confirming}
                            className="w-full py-4 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-agro-100 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                        >
                            {confirming ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Confirming…
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Payment Done — Confirm Booking
                                </>
                            )}
                        </button>

                        <button
                            onClick={onCancel}
                            disabled={confirming}
                            className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs transition-all duration-200 disabled:opacity-50"
                        >
                            Cancel — Pay Later
                        </button>
                    </div>

                    {/* ── Trust footer ── */}
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                        <ShieldCheck className="w-4 h-4 text-agro-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest">256-bit encrypted checkout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentQR;
