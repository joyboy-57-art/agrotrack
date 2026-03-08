import Booking from '../models/bookingModel.js';
import pool from '../config/db.js';
import { createSystemNotification } from './notificationController.js';


export const createBooking = async (req, res) => {
    try {
        const bookingData = { ...req.body, user_id: req.user.id };
        const booking = await Booking.create(bookingData);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAll();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.getByUserId(req.params.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        await Booking.delete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'rejected', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const result = await Booking.updateStatus(id, status);

        // Fetch user id to send notification
        const [bookingData] = await pool.query('SELECT user_id, equipment_id FROM bookings WHERE id = ?', [id]);

        if (bookingData.length > 0) {
            const userId = bookingData[0].user_id;
            let notifyMsg = `Your booking for Equipment #${bookingData[0].equipment_id} has been updated to ${status}.`;
            let type = 'info';

            if (status === 'confirmed') type = 'success';
            if (status === 'cancelled' || status === 'rejected') type = 'warning';

            await createSystemNotification(userId, notifyMsg, type);
        }

        res.json({ message: 'Status updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
