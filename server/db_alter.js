import './config/env.js';
import pool from './config/db.js';

const alterDb = async () => {
    try {
        console.log('🔄 Starting Database Schema Migration...');

        // 1. Update Users Table
        console.log('Updating users table...');
        try {
            await pool.query('ALTER TABLE users ADD COLUMN mobile_number VARCHAR(20) DEFAULT NULL');
            console.log('✅ Users table updated with mobile_number.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️ Columns already exist in users table.');
            } else {
                throw e;
            }
        }

        // 2. Create Payments Table
        console.log('Creating payments table...');
        await pool.query(`DROP TABLE IF EXISTS payments`);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                payment_id VARCHAR(100) UNIQUE NOT NULL,
                user_id INT NOT NULL,
                booking_id INT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(50) DEFAULT 'UPI',
                payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                transaction_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Payments table created.');

        // 3. Create OTPs Table
        console.log('Creating otps table...');
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS otps (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    otp VARCHAR(10) NOT NULL,
                    is_used BOOLEAN DEFAULT FALSE,
                    expires_at TIMESTAMP NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ OTPs table created.');
        } catch (e) {
            console.error('Error creating otps table:', e.message);
        }

        // 4. Update Bookings Table
        console.log('Updating bookings table...');
        try {
            await pool.query("ALTER TABLE bookings ADD COLUMN payment_status ENUM('pending', 'completed') DEFAULT 'pending'");
            console.log('✅ Bookings table updated with payment_status.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️ Column already exists in bookings table.');
            } else {
                throw e;
            }
        }

        console.log('🎉 Database Schema Migration Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error.message);
        process.exit(1);
    }
};

alterDb();
