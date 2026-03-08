import './config/env.js';
import pool from './config/db.js';

const migrateV3 = async () => {
    try {
        console.log('🔄 Starting AgroTrack V3 Migration...');

        // 1. Revert Equipment Status Column back to availability_status
        console.log('Reverting equipment status column to availability_status...');
        try {
            await pool.query(`
                ALTER TABLE equipment 
                CHANGE COLUMN status availability_status ENUM('available', 'unavailable') DEFAULT 'available'
            `);
            console.log('✅ Equipment column updated back to "availability_status".');
        } catch (e) {
            console.log('⚠️ equipment.status might already be renamed or missing:', e.message);
        }

        console.log('🎉 V3 Migration Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ V3 Migration Error:', error.message);
        process.exit(1);
    }
};

migrateV3();
