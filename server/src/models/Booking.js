"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    equipment: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    farmer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
//# sourceMappingURL=Booking.js.map