import pool from '../config/db.js';

const Booking = {
    create: async (data) => {
        const { user_id, equipment_id, start_date, end_date, total_cost, payment_status = 'pending' } = data;

        // Check availability
        const [equipment] = await pool.query('SELECT availability_status FROM equipment WHERE id = ?', [equipment_id]);
        if (!equipment.length || equipment[0].availability_status === 'unavailable') {
            throw new Error('Equipment is already securely booked or unavailable');
        }

        // Lock equipment
        await pool.query('UPDATE equipment SET availability_status = ? WHERE id = ?', ['unavailable', equipment_id]);

        const [result] = await pool.query(
            'INSERT INTO bookings (user_id, equipment_id, start_date, end_date, total_cost, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, equipment_id, start_date, end_date, total_cost, payment_status]
        );
        return { id: result.insertId, ...data, status: 'pending', payment_status };
    },

    getAll: async () => {
        const [rows] = await pool.query(
            `SELECT b.*, u.name as user_name, e.name as equipment_name 
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN equipment e ON b.equipment_id = e.id
             ORDER BY b.created_at DESC`
        );
        return rows;
    },

    getByUserId: async (userId) => {
        const [rows] = await pool.query(
            `SELECT b.*, e.name as equipment_name, e.image_url 
             FROM bookings b
             JOIN equipment e ON b.equipment_id = e.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [userId]
        );
        return rows;
    },

    updateStatus: async (id, status) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

            if (status === 'cancelled' || status === 'rejected' || status === 'completed') {
                const [booking] = await connection.query('SELECT equipment_id FROM bookings WHERE id = ?', [id]);
                if (booking.length > 0) {
                    await connection.query('UPDATE equipment SET availability_status = ? WHERE id = ?', ['available', booking[0].equipment_id]);
                }
            } else if (status === 'confirmed') {
                const [booking] = await connection.query('SELECT equipment_id FROM bookings WHERE id = ?', [id]);
                if (booking.length > 0) {
                    await connection.query('UPDATE equipment SET availability_status = ? WHERE id = ?', ['unavailable', booking[0].equipment_id]);
                }
            }

            await connection.commit();
            return { id, status };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    updatePaymentStatus: async (id, payment_status) => {
        await pool.query('UPDATE bookings SET payment_status = ? WHERE id = ?', [payment_status, id]);
        return { id, payment_status };
    },

    delete: async (id) => {
        await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
        return { id };
    }
};

export default Booking;
