import pool from '../config/db.js';

const Notification = {
    create: async (userId, message, type = 'info') => {
        const [result] = await pool.query(
            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
            [userId, message, type]
        );
        return { id: result.insertId, user_id: userId, message, type, is_read: false };
    },

    getByUserId: async (userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );
        return rows;
    },

    markAsRead: async (notificationId, userId) => {
        await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
        return { id: notificationId, is_read: true };
    },

    getUnreadCount: async (userId) => {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        return rows[0].count;
    }
};

export default Notification;
