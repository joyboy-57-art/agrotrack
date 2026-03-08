import pool from '../config/db.js';

export const getAdminStats = async (req, res) => {
    try {
        const [totalEquipment] = await pool.query('SELECT COUNT(*) as count FROM equipment');
        const [totalBookings] = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE status IN ("pending", "confirmed")');
        const [revenue] = await pool.query('SELECT SUM(total_cost) as total FROM bookings WHERE status IN ("pending", "confirmed")');
        const [activeRentals] = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed" AND end_date >= CURDATE()');

        // Analytics data
        const [mostRented] = await pool.query(
            `SELECT e.name, COUNT(b.id) as count 
             FROM bookings b 
             JOIN equipment e ON b.equipment_id = e.id 
             WHERE b.status IN ('pending', 'confirmed')
             GROUP BY e.id 
             ORDER BY count DESC 
             LIMIT 5`
        );

        const [monthlyRevenue] = await pool.query(
            `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_cost) as revenue 
             FROM bookings 
             WHERE status IN ('pending', 'confirmed') 
             GROUP BY month 
             ORDER BY month DESC 
             LIMIT 6`
        );

        res.json({
            stats: {
                totalEquipment: totalEquipment[0].count,
                totalBookings: totalBookings[0].count,
                revenue: revenue[0].total || 0,
                activeRentals: activeRentals[0].count
            },
            charts: {
                mostRented,
                monthlyRevenue: monthlyRevenue.reverse()
            }
        });
    } catch (error) {
        console.error("Admin stats fetch failed:", error);
        res.status(500).json({ message: "Analytics fetch failed" });
    }
};
