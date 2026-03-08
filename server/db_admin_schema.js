import './config/env.js';
import pool from './config/db.js';

const applyAdminSchemaUpdates = async () => {
    try {
        console.log('🔄 Applying Admin Dashboard Schema Updates...');

        // 1. Update Bookings Table with detailed status
        console.log('Updating bookings status column...');
        try {
            await pool.query("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending'");
            console.log('✅ Bookings table status column updated.');
        } catch (e) {
            console.error('Error modifying bookings status:', e.message);
        }

        // 2. Update Equipment Table with availability_status
        console.log('Adding availability_status to equipment...');
        try {
            await pool.query("ALTER TABLE equipment ADD COLUMN availability_status ENUM('Available', 'Unavailable') DEFAULT 'Available'");
            console.log('✅ Equipment table updated with availability_status.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️ availability_status already exists in equipment table.');
            } else {
                console.error('Error adding availability_status:', e.message);
            }
        }

        console.log('🎉 Admin Schema Migration Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error.message);
        process.exit(1);
    }
};

applyAdminSchemaUpdates();
