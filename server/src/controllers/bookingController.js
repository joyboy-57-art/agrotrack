"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getEquipmentBookings = exports.getMyBookings = exports.createBooking = void 0;
const express_1 = require("express");
const Booking_1 = require("../models/Booking");
const Equipment_1 = require("../models/Equipment");
const createBooking = async (req, res) => {
    try {
        const { equipmentId, startDate, endDate, totalCost } = req.body;
        const equipment = await Equipment_1.Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        // Basic double booking check
        const overlappingBookings = await Booking_1.Booking.find({
            equipment: equipmentId,
            status: { $in: ['Confirmed', 'Pending'] },
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });
        if (overlappingBookings.length > 0) {
            return res.status(400).json({ message: 'Equipment is already booked for these dates' });
        }
        const booking = new Booking_1.Booking({
            equipment: equipmentId,
            farmer: req.user._id,
            startDate,
            endDate,
            totalCost,
        });
        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBooking = createBooking;
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.Booking.find({ farmer: req.user._id }).populate('equipment', 'title type images pricePerDay');
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyBookings = getMyBookings;
const getEquipmentBookings = async (req, res) => {
    try {
        // For equipment owners to see bookings for their equipment
        const equipments = await Equipment_1.Equipment.find({ owner: req.user._id }).select('_id');
        const equipmentIds = equipments.map(eq => eq._id);
        const bookings = await Booking_1.Booking.find({ equipment: { $in: equipmentIds } })
            .populate('equipment', 'title')
            .populate('farmer', 'name email');
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEquipmentBookings = getEquipmentBookings;
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // Confirmed, Cancelled, Completed
        const booking = await Booking_1.Booking.findById(req.params.id).populate('equipment');
        if (booking) {
            // Check if user is the owner of the equipment
            const equipment = booking.equipment;
            if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin' && req.user._id.toString() !== booking.farmer.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this booking' });
            }
            booking.status = status || booking.status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        }
        else {
            res.status(404).json({ message: 'Booking not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
//# sourceMappingURL=bookingController.js.map