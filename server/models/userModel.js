import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
    create: async (name, email, password, role = 'farmer', mobile_number) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, mobile_number) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, mobile_number]
        );
        return { id: result.insertId, name, email, role, mobile_number };
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT id, name, email, role, mobile_number, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    getPasswordById: async (id) => {
        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
        return rows[0]?.password;
    },

    checkDuplicateEmailOrMobile: async (id, email, mobile_number) => {
        const [rows] = await pool.query(
            'SELECT id FROM users WHERE (email = ? OR mobile_number = ?) AND id != ?',
            [email, mobile_number, id]
        );
        return rows.length > 0;
    },

    updateProfile: async (id, data) => {
        let sql = 'UPDATE users SET name = ?, email = ?, mobile_number = ?';
        let params = [data.name, data.email, data.mobile_number];

        if (data.password) {
            sql += ', password = ?';
            const hashedPassword = await bcrypt.hash(data.password, 10);
            params.push(hashedPassword);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        await pool.query(sql, params);
        return { id, name: data.name, email: data.email, mobile_number: data.mobile_number };
    }
};

export default User;
