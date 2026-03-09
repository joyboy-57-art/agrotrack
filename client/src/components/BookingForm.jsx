import React, { useState } from 'react';
import BookingDatePicker from './BookingDatePicker';
import PaymentQR from './PaymentQR';
import paymentService from '../services/paymentService';

/**
 * BookingForm — orchestrates the two-step booking + payment flow:
 *   Step 1 (BookingDatePicker): User picks dates → createBooking is called once
 *   Step 2 (PaymentQR modal):   QR code is shown → user confirms → verifyPayment
 */
const BookingForm = ({ equipment, onSuccess }) => {
    // Holds the booking object returned by POST /api/bookings
    const [pendingBooking, setPendingBooking] = useState(null);
    // Holds the payment intent returned by POST /api/payments/create
    const [paymentIntent, setPaymentIntent] = useState(null);
    // Loading / error state while creating the payment intent
    const [intentLoading, setIntentLoading] = useState(false);
    const [intentError, setIntentError] = useState('');

    /**
     * Called by BookingDatePicker after a booking is successfully created.
     * Creates a payment intent and then opens the QR modal.
     */
    const handleBookingCreated = async (booking) => {
        setIntentLoading(true);
        setIntentError('');
        try {
            const intent = await paymentService.createPayment({
                booking_id: booking.id,
                total_amount: booking.total_cost,
                payment_method: 'QR_CODE',
            });
            setPendingBooking(booking);
            setPaymentIntent(intent);
        } catch (err) {
            setIntentError(
                err.response?.data?.message ||
                'Could not initialise payment. Please try again.'
            );
        } finally {
            setIntentLoading(false);
        }
    };

    /** Reset back to the date-picker if the user cancels payment */
    const handlePaymentCancel = () => {
        setPendingBooking(null);
        setPaymentIntent(null);
        setIntentError('');
    };

    return (
        <>
            {/* ── Step 1: Date picker (shown when no pending booking) ── */}
            {!pendingBooking && (
                <div className="flex flex-col gap-4">
                    <BookingDatePicker
                        equipment={equipment}
                        onBookingCreated={handleBookingCreated}
                    />
                    {/* Show intent-creation error below the picker if it occurs */}
                    {intentLoading && (
                        <p className="text-center text-sm text-emerald-600 font-medium animate-pulse">
                            Setting up payment…
                        </p>
                    )}
                    {intentError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                            {intentError}
                        </div>
                    )}
                </div>
            )}

            {/* ── Step 2: QR Payment modal (shown once booking + intent are ready) ── */}
            {pendingBooking && paymentIntent && (
                <PaymentQR
                    booking={pendingBooking}
                    paymentIntent={paymentIntent}
                    amount={pendingBooking.total_cost}
                    equipmentName={equipment.name}
                    onSuccess={onSuccess}
                    onCancel={handlePaymentCancel}
                />
            )}
        </>
    );
};

export default BookingForm;
