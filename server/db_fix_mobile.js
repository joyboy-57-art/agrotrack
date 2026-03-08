import './config/env.js';
import pool from './config/db.js';

const fixDb = async () => {
    try {
        console.log('🔄 Fixing mobile_number length...');
        await pool.query('ALTER TABLE users MODIFY mobile_number VARCHAR(20) DEFAULT NULL');
        console.log('✅ Users table mobile_number changed to VARCHAR(20).');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error.message);
        process.exit(1);
    }
};

fixDb();
