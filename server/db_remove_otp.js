import './config/env.js';
import pool from './config/db.js';

const removeOTP = async () => {
    try {
        console.log('🔄 Starting OTP Cleanup Migration...');

        // 1. Drop OTPs Table
        console.log('Dropping otps table...');
        await pool.query('DROP TABLE IF EXISTS otps');
        console.log('✅ OTP table dropped.');

        // 2. Remove is_mobile_verified from users
        console.log('Removing is_mobile_verified from users table...');
        try {
            await pool.query('ALTER TABLE users DROP COLUMN is_mobile_verified');
            console.log('✅ Users table cleaned of is_mobile_verified.');
        } catch (e) {
            if (e.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                console.log('⚠️ Column is_mobile_verified already dropped.');
            } else {
                throw e;
            }
        }

        console.log('🎉 OTP Schema Cleanup Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error.message);
        process.exit(1);
    }
};

removeOTP();
