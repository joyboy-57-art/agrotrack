import pool from '../config/db.js';

const Payment = {
    create: async (data) => {
        const { payment_id, user_id, booking_id, total_amount, payment_method, payment_status, transaction_id } = data;

        const [result] = await pool.query(
            'INSERT INTO payments (payment_id, user_id, booking_id, total_amount, payment_method, payment_status, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [payment_id, user_id, booking_id, total_amount, payment_method, payment_status, transaction_id]
        );
        return { id: result.insertId, ...data };
    },

    getByBookingId: async (bookingId) => {
        const [rows] = await pool.query('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);
        return rows[0];
    },

    updateStatus: async (paymentId, status) => {
        await pool.query('UPDATE payments SET payment_status = ? WHERE payment_id = ?', [status, paymentId]);
        return { paymentId, status };
    }
};

export default Payment;
