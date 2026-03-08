import './config/env.js';

import pool from './config/db.js';
import User from './models/userModel.js';
import Equipment from './models/equipmentModel.js';

const seed = async () => {
    try {
        console.log('🌱 Seeding database...');

        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE payments');
        await pool.query('TRUNCATE TABLE bookings');
        await pool.query('TRUNCATE TABLE equipment');
        await pool.query('TRUNCATE TABLE users');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        // Seed Users
        await User.create('Admin User', 'admin@agrotrack.com', 'password123', 'admin');
        await User.create('Ramesh Kumar', 'ramesh@agrotrack.com', 'password123', 'farmer');
        await User.create('Suresh Patel', 'suresh@agrotrack.com', 'password123', 'farmer');

        // Seed Equipment with real Unsplash images
        const machinery = [
            // Tractors
            { name: 'John Deere 5050D Tractor', category: 'Tractors', price_per_day: 2500, location: 'Pune, Maharashtra', description: 'A 50 HP powerhouse perfect for all farming operations.', image_url: 'https://plus.unsplash.com/premium_photo-1661808770389-30a3ed35b7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dHJhY3RvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Mahindra Arjun Novo 605', category: 'Tractors', price_per_day: 2200, location: 'Nashik, Maharashtra', description: 'Advanced 4WD tractor with superior lift capacity and turbo engine.', image_url: 'https://images.unsplash.com/photo-1684566982052-94d4c47d259e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dHJhY3RvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Swaraj 744 FE Tractor', category: 'Tractors', price_per_day: 2100, location: 'Ludhiana, Punjab', description: 'Reliable 48 HP tractor suitable for heavy implements.', image_url: 'https://images.unsplash.com/photo-1652938109593-97d51a5278da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dHJhY3RvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Massey Ferguson 241 DI', category: 'Tractors', price_per_day: 2000, location: 'Bhopal, Madhya Pradesh', description: 'Versatile 42 HP tractor excellent for haulage and cultivation.', image_url: 'https://images.unsplash.com/photo-1652938109589-3700f25e5659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8dHJhY3RvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Sonalika Tiger 50', category: 'Tractors', price_per_day: 2300, location: 'Ahmedabad, Gujarat', description: 'Modern 52 HP tractor designed in Europe.', image_url: 'https://plus.unsplash.com/premium_photo-1661964468479-5cb50f178859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8dHJhY3RvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Harvesters
            { name: 'Kubota DC-68G Harvester', category: 'Harvesters', price_per_day: 5000, location: 'Amritsar, Punjab', description: 'High-efficiency combine harvester for wheat and paddy.', image_url: 'https://plus.unsplash.com/premium_photo-1661959988848-2baeac715ac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y29tYmluZSUyMGhhcnZlc3RlcnxlbnwwfHx8fDE3NzI3NzA1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Sonalika Combine Harvester', category: 'Harvesters', price_per_day: 4500, location: 'Ludhiana, Punjab', description: 'Wide-cut drum combine with grain-loss monitor.', image_url: 'https://images.unsplash.com/photo-1635174815612-fd9636f70146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y29tYmluZSUyMGhhcnZlc3RlcnxlbnwwfHx8fDE3NzI3NzA1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Class Crop Tiger 40', category: 'Harvesters', price_per_day: 5500, location: 'Karnal, Haryana', description: 'Compact track-based harvester ideal for wet paddy fields.', image_url: 'https://images.unsplash.com/photo-1565647952915-9644fcd446a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y29tYmluZSUyMGhhcnZlc3RlcnxlbnwwfHx8fDE3NzI3NzA1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Preet 987 Combine', category: 'Harvesters', price_per_day: 4800, location: 'Patiala, Punjab', description: 'Powerful multi-crop harvester designed for Indian conditions.', image_url: 'https://images.unsplash.com/photo-1507311036505-05669fc503cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Y29tYmluZSUyMGhhcnZlc3RlcnxlbnwwfHx8fDE3NzI3NzA1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Plough
            { name: 'Heavy Duty Reversible Plough', category: 'Plough', price_per_day: 800, location: 'Agra, UP', description: '2 Bottom Reversible Plough for deep penetration.', image_url: 'https://plus.unsplash.com/premium_photo-1661963430474-0d8e61dcd2ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZmFybWluZyUyMHBsb3VnaHxlbnwwfHx8fDE3NzI3NzA1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Lemken Opal 090', category: 'Plough', price_per_day: 950, location: 'Pune, Maharashtra', description: 'Premium mouldboard plough that guarantees perfect soil turning.', image_url: 'https://images.unsplash.com/photo-1622562014358-2ad7e00d67f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZmFybWluZyUyMHBsb3VnaHxlbnwwfHx8fDE3NzI3NzA1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Fieldking Disc Plough', category: 'Plough', price_per_day: 700, location: 'Indore, MP', description: 'Tractor drawn disc plough suitable for hard ground.', image_url: 'https://images.unsplash.com/photo-1760947960930-e2701e352eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZmFybWluZyUyMHBsb3VnaHxlbnwwfHx8fDE3NzI3NzA1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Mahindra MB Plough', category: 'Plough', price_per_day: 750, location: 'Nagpur, Maharashtra', description: 'Designed to break, raise, and turn the soil efficiently.', image_url: 'https://images.unsplash.com/photo-1727514606723-54581e9562ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZmFybWluZyUyMHBsb3VnaHxlbnwwfHx8fDE3NzI3NzA1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Seed Drill
            { name: 'Precision Zero Till Seed Drill', category: 'Seed Drill', price_per_day: 1500, location: 'Nagpur, Maharashtra', description: 'Multi-crop seed drill for precise row seeding without plowing.', image_url: 'https://plus.unsplash.com/premium_photo-1661922800416-c0b49b9bb77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZmFybWluZyUyMHNlZWRlcnxlbnwwfHx8fDE3NzI3NzA1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Pneumatic Planter 4 Row', category: 'Seed Drill', price_per_day: 1800, location: 'Jalgaon, Maharashtra', description: 'Highly accurate vacuum planter for cotton, maize, and soybeans.', image_url: 'https://images.unsplash.com/photo-1706862609885-7771b001daa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZmFybWluZyUyMHNlZWRlcnxlbnwwfHx8fDE3NzI3NzA1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Happy Seeder', category: 'Seed Drill', price_per_day: 1400, location: 'Ambala, Haryana', description: 'Sows wheat directly into paddy residue without burning.', image_url: 'https://images.unsplash.com/photo-1761146032938-edc3670a9869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZmFybWluZyUyMHNlZWRlcnxlbnwwfHx8fDE3NzI3NzA1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Multi-Crop Planter', category: 'Seed Drill', price_per_day: 1200, location: 'Jaipur, Rajasthan', description: 'Mechanically deposits seeds at equal distances and proper depth.', image_url: 'https://images.unsplash.com/photo-1591714345924-9957eb4014e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZmFybWluZyUyMHNlZWRlcnxlbnwwfHx8fDE3NzI3NzA1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Irrigation
            { name: 'Drip Irrigation Kit (5 Acre)', category: 'Irrigation', price_per_day: 800, location: 'Coimbatore, Tamil Nadu', description: 'Complete drip irrigation setup. Saves 40% water.', image_url: 'https://plus.unsplash.com/premium_photo-1661825536186-19606cd9a0f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZmFybSUyMGlycmlnYXRpb258ZW58MHx8fHwxNzcyNzcwNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Rain Gun Sprinkler', category: 'Irrigation', price_per_day: 600, location: 'Ahmednagar, Maharashtra', description: 'High volume and high-pressure sprinkler covering a wide radius.', image_url: 'https://images.unsplash.com/photo-1743742566156-f1745850281a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZmFybSUyMGlycmlnYXRpb258ZW58MHx8fHwxNzcyNzcwNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Solar Water Pump 5HP', category: 'Irrigation', price_per_day: 1200, location: 'Jodhpur, Rajasthan', description: 'Off-grid solar powered submersible water pump system.', image_url: 'https://images.unsplash.com/photo-1692369584496-3216a88f94c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZmFybSUyMGlycmlnYXRpb258ZW58MHx8fHwxNzcyNzcwNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Self-Propelled Boom Sprinkler', category: 'Irrigation', price_per_day: 2000, location: 'Ludhiana, Punjab', description: 'Automated linear move irrigation system for large fields.', image_url: 'https://images.unsplash.com/photo-1675851778840-753170c0dbf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZmFybSUyMGlycmlnYXRpb258ZW58MHx8fHwxNzcyNzcwNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Rotavator
            { name: 'Fieldking Multi-Crop Rotavator', category: 'Rotavator', price_per_day: 1200, location: 'Indore, MP', description: 'Heavy-duty rotavator for deep tilling and seedbed preparation.', image_url: 'https://plus.unsplash.com/premium_photo-1661812296865-9901e6ded46d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dGlsbGVyJTIwc29pbCUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Shaktiman Regular Light', category: 'Rotavator', price_per_day: 1000, location: 'Rajkot, Gujarat', description: 'Designed for light soils and wet land applications.', image_url: 'https://images.unsplash.com/photo-1750016065255-cab6cc76c8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dGlsbGVyJTIwc29pbCUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Maschio Gaspardo Virno', category: 'Rotavator', price_per_day: 1400, location: 'Pune, Maharashtra', description: 'Premium rotary tiller designed for excellent soil refinement.', image_url: 'https://images.unsplash.com/photo-1720420866171-c5ed68a903a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dGlsbGVyJTIwc29pbCUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Mahindra Gyrovator', category: 'Rotavator', price_per_day: 1100, location: 'Bhopal, MP', description: 'High-performance rotavator pulverizes soil into fine particles.', image_url: 'https://images.unsplash.com/photo-1703001130519-8b6ecc9b6a96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8dGlsbGVyJTIwc29pbCUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Sprayer
            { name: 'Tractor Mounted Boom Sprayer', category: 'Sprayer', price_per_day: 1500, location: 'Sangli, Maharashtra', description: '400L tank capacity with 12m boom width for uniform chemical application.', image_url: 'https://plus.unsplash.com/premium_photo-1661920502026-f6385738743a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZmFybSUyMHNwcmF5ZXJ8ZW58MHx8fHwxNzcyNzcwNTU0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Battery Operated Knapsack Sprayer', category: 'Sprayer', price_per_day: 300, location: 'Nashik, Maharashtra', description: 'Portable 16L sprayer, ideal for small farms and orchards.', image_url: 'https://images.unsplash.com/photo-1590068484425-00751653640f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZmFybSUyMHNwcmF5ZXJ8ZW58MHx8fHwxNzcyNzcwNTU0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Orchard Air Blast Sprayer', category: 'Sprayer', price_per_day: 1800, location: 'Shimla, HP', description: 'Creates a fine mist, essential for dense fruit orchards.', image_url: 'https://images.unsplash.com/photo-1758414089320-dac72d347fca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8ZmFybSUyMHNwcmF5ZXJ8ZW58MHx8fHwxNzcyNzcwNTU0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Self-Propelled High Clearance Sprayer', category: 'Sprayer', price_per_day: 3500, location: 'Karnal, Haryana', description: 'High capacity sprayer for tall crops like sugarcane and cotton.', image_url: 'https://images.unsplash.com/photo-1755931359594-852c73c6609c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8ZmFybSUyMHNwcmF5ZXJ8ZW58MHx8fHwxNzcyNzcwNTU0fDA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Cultivator
            { name: '9 Tine Spring Loaded Cultivator', category: 'Cultivator', price_per_day: 700, location: 'Aurangabad, Maharashtra', description: 'Absorbs shocks from stone and roots in the field.', image_url: 'https://plus.unsplash.com/premium_photo-1661902899911-d7b89906e638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y3VsdGl2YXRvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTU1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Rigid Cultivator 11 Tine', category: 'Cultivator', price_per_day: 600, location: 'Nanded, Maharashtra', description: 'Sturdy cultivator for deep plowing in normal soil.', image_url: 'https://images.unsplash.com/photo-1766854976042-0e6943230607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y3VsdGl2YXRvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTU1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Power Weeder (Petrol)', category: 'Cultivator', price_per_day: 600, location: 'Kolhapur, Maharashtra', description: 'Lightweight petrol-powered weeder for inter-row weed removal.', image_url: 'https://images.unsplash.com/photo-1771574205637-40df52ec136c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y3VsdGl2YXRvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTU1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Inter-row Rotary Cultivator', category: 'Cultivator', price_per_day: 900, location: 'Belagavi, Karnataka', description: 'Designed to eliminate weeds between rows of standing crops.', image_url: 'https://images.unsplash.com/photo-1762291347492-c15634c64f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Y3VsdGl2YXRvciUyMGZhcm1pbmd8ZW58MHx8fHwxNzcyNzcwNTU1fDA&ixlib=rb-4.1.0&q=80&w=1080' },

            // Thresher
            { name: 'Multi-Crop Thresher', category: 'Thresher', price_per_day: 2000, location: 'Gwalior, MP', description: 'Can thresh wheat, soybean, maize, and gram with simple adjustments.', image_url: 'https://plus.unsplash.com/premium_photo-1677682546110-2880cad3cb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dGhyZXNoaW5nJTIwbWFjaGluZXxlbnwwfHx8fDE3NzI3NzA1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Paddy Thresher (Motorized)', category: 'Thresher', price_per_day: 1500, location: 'Raipur, Chhattisgarh', description: 'Axial flow thresher specifically designed for high capacity paddy separation.', image_url: 'https://images.unsplash.com/photo-1646021806026-38fbc0b23217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dGhyZXNoaW5nJTIwbWFjaGluZXxlbnwwfHx8fDE3NzI3NzA1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Maize Sheller', category: 'Thresher', price_per_day: 1200, location: 'Patna, Bihar', description: 'Fast and efficient corn shelling machine driven by tractor PTO.', image_url: 'https://images.unsplash.com/photo-1742579373744-c9eb35987324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dGhyZXNoaW5nJTIwbWFjaGluZXxlbnwwfHx8fDE3NzI3NzA1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
            { name: 'Groundnut Decorticator', category: 'Thresher', price_per_day: 1400, location: 'Rajkot, Gujarat', description: 'Specialized machine for separating groundnut pods from plants safely.', image_url: 'https://images.unsplash.com/photo-1730700521745-7648ef0abd0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8dGhyZXNoaW5nJTIwbWFjaGluZXxlbnwwfHx8fDE3NzI3NzA1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' }
        ];

        for (const item of machinery) {
            await Equipment.create(item);
        }

        console.log('✅ Database seeded successfully!');
        console.log('👤 Admin: admin@agrotrack.com / password123');
        console.log('👤 Farmer: ramesh@agrotrack.com / password123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seed();
