import Payment from '../models/paymentModel.js';
import Booking from '../models/bookingModel.js';

export const createPayment = async (req, res) => {
    try {
        const { booking_id, total_amount, payment_method } = req.body;
        const user_id = req.user.id;

        // In a real app here you would call Razorpay, Stripe or a UPI gateway
        // We'll simulate a payment intent creation with a dummy transaction ID
        const payment_id = 'pay_' + Math.random().toString(36).substr(2, 9);
        const transaction_id = 'txn_' + Date.now();

        const payment = await Payment.create({
            payment_id,
            user_id,
            booking_id,
            total_amount,
            payment_method: payment_method || 'UPI',
            payment_status: 'pending',
            transaction_id
        });

        res.status(201).json({
            message: 'Payment intent created',
            payment_id: payment.payment_id,
            transaction_id: payment.transaction_id,
            amount: total_amount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { payment_id, booking_id, status } = req.body; // status would come from gateway webhook/callback

        if (status === 'success') {
            await Payment.updateStatus(payment_id, 'completed');
            await Booking.updatePaymentStatus(booking_id, 'completed');

            res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            await Payment.updateStatus(payment_id, 'failed');
            res.status(400).json({ message: 'Payment failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
