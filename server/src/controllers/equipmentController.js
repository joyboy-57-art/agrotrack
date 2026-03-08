"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEquipment = exports.updateEquipment = exports.createEquipment = exports.getEquipmentById = exports.getEquipments = void 0;
const express_1 = require("express");
const Equipment_1 = require("../models/Equipment");
const getEquipments = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};
        const equipments = await Equipment_1.Equipment.find({ ...keyword }).populate('owner', 'name email');
        res.json(equipments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEquipments = getEquipments;
const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment_1.Equipment.findById(req.params.id).populate('owner', 'name email');
        if (equipment) {
            res.json(equipment);
        }
        else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEquipmentById = getEquipmentById;
const createEquipment = async (req, res) => {
    try {
        const { title, type, description, pricePerHour, pricePerDay, location, images } = req.body;
        const equipment = new Equipment_1.Equipment({
            title,
            type,
            description,
            pricePerHour,
            pricePerDay,
            location,
            images: images || [],
            owner: req.user._id,
        });
        const createdEquipment = await equipment.save();
        res.status(201).json(createdEquipment);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createEquipment = createEquipment;
const updateEquipment = async (req, res) => {
    try {
        const { title, type, description, pricePerHour, pricePerDay, location, isAvailable, images } = req.body;
        const equipment = await Equipment_1.Equipment.findById(req.params.id);
        if (equipment) {
            // Check ownership
            if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                return res.status(401).json({ message: 'Not authorized to update this equipment' });
            }
            equipment.title = title || equipment.title;
            equipment.type = type || equipment.type;
            equipment.description = description || equipment.description;
            equipment.pricePerHour = pricePerHour || equipment.pricePerHour;
            equipment.pricePerDay = pricePerDay || equipment.pricePerDay;
            equipment.location = location || equipment.location;
            equipment.isAvailable = isAvailable !== undefined ? isAvailable : equipment.isAvailable;
            if (images)
                equipment.images = images;
            const updatedEquipment = await equipment.save();
            res.json(updatedEquipment);
        }
        else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateEquipment = updateEquipment;
const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment_1.Equipment.findById(req.params.id);
        if (equipment) {
            if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                return res.status(401).json({ message: 'Not authorized to delete this equipment' });
            }
            await equipment.deleteOne();
            res.json({ message: 'Equipment removed' });
        }
        else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteEquipment = deleteEquipment;
//# sourceMappingURL=equipmentController.js.map