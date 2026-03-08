import cron from 'node-cron';
import pool from '../config/db.js';
import { createSystemNotification } from '../controllers/notificationController.js';

export const startCronJobs = () => {
    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('⏳ Running daily status check for bookings and equipment...');

        try {
            // Find bookings that have passed their end_date and are still confirmed
            const [expiredBookings] = await pool.query(`
                SELECT id, user_id, equipment_id, end_date 
                FROM bookings 
                WHERE status = 'confirmed' AND end_date < CURDATE()
            `);

            if (expiredBookings.length === 0) {
                console.log('✅ No expired bookings found. Check complete.');
                return;
            }

            console.log(`Found ${expiredBookings.length} expired bookings to process.`);

            for (const booking of expiredBookings) {
                // 1. Mark booking as completed
                await pool.query('UPDATE bookings SET status = ? WHERE id = ?', ['completed', booking.id]);

                // 2. Mark equipment as available
                await pool.query('UPDATE equipment SET availability_status = ? WHERE id = ?', ['available', booking.equipment_id]);

                // 3. Notify user
                await createSystemNotification(
                    booking.user_id,
                    `Your booking for equipment ID ${booking.equipment_id} has concluded. Thank you for using AgroTrack!`,
                    'success'
                );
            }
            console.log('✅ Daily status check complete.');

        } catch (error) {
            console.error('❌ Error in automated status check:', error);
        }
    });
};
