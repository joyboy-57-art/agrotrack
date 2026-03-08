import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Equipment } from '../models/Equipment';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { equipmentId, startDate, endDate, totalCost } = req.body;

        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Basic double booking check
        const overlappingBookings = await Booking.find({
            equipment: equipmentId,
            status: { $in: ['Confirmed', 'Pending'] },
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ message: 'Equipment is already booked for these dates' });
        }

        const booking = new Booking({
            equipment: equipmentId,
            farmer: req.user._id,
            startDate,
            endDate,
            totalCost,
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find({ farmer: req.user._id }).populate('equipment', 'title type images pricePerDay');
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEquipmentBookings = async (req: Request, res: Response) => {
    try {
        // For equipment owners to see bookings for their equipment
        const equipments = await Equipment.find({ owner: req.user._id }).select('_id');
        const equipmentIds = equipments.map(eq => eq._id);

        const bookings = await Booking.find({ equipment: { $in: equipmentIds } })
            .populate('equipment', 'title')
            .populate('farmer', 'name email');

        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body; // Confirmed, Cancelled, Completed
        const booking = await Booking.findById(req.params.id).populate('equipment');

        if (booking) {
            // Check if user is the owner of the equipment
            const equipment: any = booking.equipment;
            if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin' && req.user._id.toString() !== booking.farmer.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this booking' });
            }

            booking.status = status || booking.status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
