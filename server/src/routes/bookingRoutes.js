"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, bookingController_1.createBooking);
router.route('/mine').get(auth_1.protect, bookingController_1.getMyBookings);
router.route('/equipment').get(auth_1.protect, auth_1.ownerOrAdmin, bookingController_1.getEquipmentBookings);
router.route('/:id/status').put(auth_1.protect, bookingController_1.updateBookingStatus);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map