import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
