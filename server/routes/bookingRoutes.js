import express from 'express';
import {
    createBooking,
    getBookings,
    getUserBookings,
    deleteBooking,
    updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/user/:id', protect, getUserBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

export default router;
