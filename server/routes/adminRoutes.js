import express from 'express';
import { getDashboardAnalytics, getAllUsers, getAllPayments } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, admin, getDashboardAnalytics);
router.get('/users', protect, admin, getAllUsers);
router.get('/payments', protect, admin, getAllPayments);

export default router;
