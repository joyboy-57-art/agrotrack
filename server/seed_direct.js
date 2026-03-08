/**
 * Standalone seed script - works independently of module loading order.
 * Run: node seed_direct.js
 */
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'agrotrack',
};

const seed = async () => {
    const conn = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    try {
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('TRUNCATE TABLE payments');
        await conn.query('TRUNCATE TABLE bookings');
        await conn.query('TRUNCATE TABLE equipment');
        await conn.query('TRUNCATE TABLE users');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🗑️  Tables cleared');

        // Users
        const passwordHash = await bcrypt.hash('password123', 10);
        await conn.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Admin User', 'admin@agrotrack.com', passwordHash, 'admin']);
        await conn.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Ramesh Kumar', 'ramesh@agrotrack.com', passwordHash, 'farmer']);
        await conn.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Suresh Patel', 'suresh@agrotrack.com', passwordHash, 'farmer']);
        console.log('👤 Users seeded');

        // Equipment with Unsplash images
        const machinery = [
            ['John Deere 5050D Tractor', 'Tractors', 'A 50 HP powerhouse for all farming operations. Renowned for durability and fuel efficiency.', 2500, 'Pune, Maharashtra', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=800&q=80', 1],
            ['Kubota DC-68G Combine Harvester', 'Harvesters', 'High-efficiency combine harvester for wheat and paddy. Cuts, threshes, and cleans grain in one pass.', 5000, 'Amritsar, Punjab', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80', 1],
            ['Heavy Duty Reversible Plough', 'Plough', 'Hydraulic reversible MB plough for deep tillage and soil turning. Suitable for hard soils.', 800, 'Nashik, Maharashtra', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', 1],
            ['Precision Seed Drill', 'Seed Drill', 'Multi-crop seed drill for precise row seeding. Supports wheat, maize, soybean with adjustable spacing.', 1500, 'Nagpur, Maharashtra', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80', 1],
            ['Rotavator Multi-Crop Tiller', 'Rotavator', 'Heavy-duty rotavator for deep tilling and seedbed preparation. Works on all soil types.', 1200, 'Indore, Madhya Pradesh', 'https://images.unsplash.com/photo-1593926207032-41617e132910?auto=format&fit=crop&w=800&q=80', 1],
            ['Knapsack Power Sprayer', 'Sprayer', 'Engine-backed high-pressure sprayer for pesticides and fertilizers. 20-liter tank capacity.', 400, 'Coimbatore, Tamil Nadu', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', 1],
            ['Spring Loaded Cultivator', 'Cultivator', '9-tine spring-loaded cultivator for breaking clods and weed control in orchards and open fields.', 700, 'Aurangabad, Maharashtra', 'https://images.unsplash.com/photo-1533637902604-1c5abcde8ee6?auto=format&fit=crop&w=800&q=80', 1],
            ['Multi-Crop Thresher', 'Thresher', 'High-capacity thresher suitable for wheat, soybean, and gram. Excellent grain cleaning efficiency.', 1800, 'Ludhiana, Punjab', 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80', 1],
        ];

        for (const item of machinery) {
            await conn.query(
                'INSERT INTO equipment (name, category, description, price_per_day, location, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)',
                item
            );
        }
        console.log('🚜 Equipment seeded (8 items)');
        console.log('');
        console.log('✅ Database seeded successfully!');
        console.log('👤 Admin:  admin@agrotrack.com / password123');
        console.log('👤 Farmer: ramesh@agrotrack.com / password123');
    } finally {
        await conn.end();
    }
    process.exit(0);
};

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
