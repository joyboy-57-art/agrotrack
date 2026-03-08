import pool from '../config/db.js';

export const fixMobileColumn = async () => {
    try {
        console.log('🔄 Checking database schema...');

        // Fix users table columns
        await pool.query(`
            ALTER TABLE users 
            MODIFY COLUMN name VARCHAR(100),
            MODIFY COLUMN email VARCHAR(100),
            MODIFY COLUMN mobile_number VARCHAR(15),
            MODIFY COLUMN password VARCHAR(255),
            MODIFY COLUMN role VARCHAR(20) DEFAULT 'farmer'
        `);
        console.log('✅ Users table schema aligned.');

        // Ensure equipment table columns
        // (Just basic check for common issues, like availability_status)
        await pool.query(`
            ALTER TABLE equipment 
            MODIFY COLUMN availability_status ENUM('available', 'unavailable') DEFAULT 'available'
        `);
        console.log('✅ Equipment table schema aligned.');

        // Ensure bookings table schema
        await pool.query(`
            ALTER TABLE bookings 
            MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending',
            MODIFY COLUMN payment_status VARCHAR(20) DEFAULT 'pending'
        `);
        console.log('✅ Bookings table schema aligned.');

    } catch (error) {
        console.error('❌ Error during schema alignment:', error.message);
    }
};
