import express from 'express';
import { createBooking, getMyBookings, getEquipmentBookings, updateBookingStatus } from '../controllers/bookingController';
import { protect, ownerOrAdmin } from '../middleware/auth';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/mine').get(protect, getMyBookings);
router.route('/equipment').get(protect, ownerOrAdmin, getEquipmentBookings);
router.route('/:id/status').put(protect, updateBookingStatus);

export default router;
