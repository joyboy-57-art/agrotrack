"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const equipmentSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    images: [{ type: String }],
    location: { type: String, required: true },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
exports.Equipment = mongoose_1.default.model('Equipment', equipmentSchema);
//# sourceMappingURL=Equipment.js.map