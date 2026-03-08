import pool from '../config/db.js';

const Equipment = {
    getAll: async (keyword = '') => {
        let sql = 'SELECT * FROM equipment';
        let params = [];
        if (keyword) {
            sql += ' WHERE name LIKE ? OR category LIKE ? OR location LIKE ?';
            params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
        }
        const [rows] = await pool.query(sql, params);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const { name, category, price_per_day, location, description, image_url, availability_status = 'Available' } = data;
        const [result] = await pool.query(
            'INSERT INTO equipment (name, category, price_per_day, location, description, image_url, availability_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, category, price_per_day, location, description, image_url, availability_status]
        );
        return { id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const params = [...Object.values(data), id];
        await pool.query(`UPDATE equipment SET ${fields} WHERE id = ?`, params);
        return { id, ...data };
    },

    delete: async (id) => {
        await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
        return { id };
    }
};

export default Equipment;
