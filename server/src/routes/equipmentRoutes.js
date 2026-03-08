"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const equipmentController_1 = require("../controllers/equipmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').get(equipmentController_1.getEquipments).post(auth_1.protect, auth_1.ownerOrAdmin, equipmentController_1.createEquipment);
router.route('/:id').get(equipmentController_1.getEquipmentById).put(auth_1.protect, auth_1.ownerOrAdmin, equipmentController_1.updateEquipment).delete(auth_1.protect, auth_1.ownerOrAdmin, equipmentController_1.deleteEquipment);
exports.default = router;
//# sourceMappingURL=equipmentRoutes.js.map