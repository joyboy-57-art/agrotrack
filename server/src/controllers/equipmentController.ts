import { Request, Response } from 'express';
import { Equipment } from '../models/Equipment';

export const getEquipments = async (req: Request, res: Response) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword as string,
                    $options: 'i',
                },
            }
            : {};

        const equipments = await Equipment.find({ ...keyword }).populate('owner', 'name email');
        res.json(equipments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEquipmentById = async (req: Request, res: Response) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate('owner', 'name email');
        if (equipment) {
            res.json(equipment);
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createEquipment = async (req: Request, res: Response) => {
    try {
        const { title, type, description, pricePerHour, pricePerDay, location, images } = req.body;

        const equipment = new Equipment({
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEquipment = async (req: Request, res: Response) => {
    try {
        const { title, type, description, pricePerHour, pricePerDay, location, isAvailable, images } = req.body;

        const equipment = await Equipment.findById(req.params.id);

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
            if (images) equipment.images = images;

            const updatedEquipment = await equipment.save();
            res.json(updatedEquipment);
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEquipment = async (req: Request, res: Response) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (equipment) {
            if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                return res.status(401).json({ message: 'Not authorized to delete this equipment' });
            }

            await equipment.deleteOne();
            res.json({ message: 'Equipment removed' });
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
