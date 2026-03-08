import express from 'express';
import { getEquipments, getEquipmentById, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController';
import { protect, ownerOrAdmin } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getEquipments).post(protect, ownerOrAdmin, createEquipment);
router.route('/:id').get(getEquipmentById).put(protect, ownerOrAdmin, updateEquipment).delete(protect, ownerOrAdmin, deleteEquipment);

export default router;
