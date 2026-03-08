import Equipment from '../models/equipmentModel.js';
import pool from '../config/db.js';


export const getEquipment = async (req, res) => {
    try {
        const { keyword, isAdmin } = req.query;
        let sql = 'SELECT * FROM equipment';
        let params = [];
        let conditions = [];

        if (keyword) {
            conditions.push('(name LIKE ? OR category LIKE ? OR location LIKE ?)');
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        // If not admin, only fetch available equipment for the marketplace
        if (isAdmin !== 'true') {
            conditions.push('availability_status = "available"');
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.getById(req.params.id);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.update(req.params.id, req.body);
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    try {
        await Equipment.delete(req.params.id);
        res.json({ message: 'Equipment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
