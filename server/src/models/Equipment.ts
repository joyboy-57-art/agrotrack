import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    images: [{ type: String }],
    location: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export const Equipment = mongoose.model('Equipment', equipmentSchema);
