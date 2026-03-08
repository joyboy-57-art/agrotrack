import './config/env.js';
import pool from './config/db.js';

const migrateV2 = async () => {
    try {
        console.log('🔄 Starting AgroTrack V2 Migration...');

        // 1. Create Notifications Table
        console.log('Creating notifications table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Notifications table created.');

        // 2. Update Bookings Status Enum
        console.log('Updating bookings status enum...');
        await pool.query(`
            ALTER TABLE bookings 
            MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending'
        `);
        console.log('✅ Bookings status enum updated.');

        // 3. Update Equipment Status Column
        console.log('Updating equipment status column...');
        // Rename availability_status to status and change to ENUM
        try {
            await pool.query(`
                ALTER TABLE equipment 
                CHANGE COLUMN availability_status status ENUM('available', 'unavailable') DEFAULT 'available'
            `);
            console.log('✅ Equipment column updated to "status" with ENUM.');
        } catch (e) {
            console.log('⚠️ equipment.status might already be updated or structured differently:', e.message);
        }

        console.log('🎉 V2 Migration Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ V2 Migration Error:', error.message);
        process.exit(1);
    }
};

migrateV2();
