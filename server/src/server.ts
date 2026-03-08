import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Equipment } from './models/Equipment';
import { Booking } from './models/Booking';

import authRoutes from './routes/authRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import bookingRoutes from './routes/bookingRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await connectDB();

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        console.log('Database empty, seeding initial data...');
        try {
            const users = [
                {
                    name: 'Admin User',
                    email: 'admin@agrotrack.com',
                    password: 'password123',
                    role: 'Admin',
                },
                {
                    name: 'Ramesh Singh (Owner)',
                    email: 'ramesh@agrotrack.com',
                    password: 'password123',
                    role: 'EquipmentOwner',
                },
                {
                    name: 'Suresh Kumar (Farmer)',
                    email: 'suresh@agrotrack.com',
                    password: 'password123',
                    role: 'Farmer',
                },
            ];

            const createdUsers = await User.create(users);
            const ownerId = createdUsers[1]._id;

            const equipmentList = [
                {
                    title: 'Mahindra 575 DI Tractor',
                    type: 'Tractor',
                    description: '45 HP tractor in excellent condition. Perfect for ploughing and transport.',
                    pricePerHour: 200,
                    pricePerDay: 1500,
                    location: 'Ludhiana, Punjab',
                    images: ['/uploads/tractor1.jpg'],
                    isAvailable: true,
                    owner: ownerId,
                },
                {
                    title: 'John Deere Combine Harvester',
                    type: 'Harvester',
                    description: 'High capacity multi-crop harvester. Operator available on request.',
                    pricePerHour: 1000,
                    pricePerDay: 8000,
                    location: 'Ambala, Haryana',
                    images: ['/uploads/harvester1.jpg'],
                    isAvailable: true,
                    owner: ownerId,
                },
                {
                    title: 'Heavy Duty Reversible Plough',
                    type: 'Plough',
                    description: '2-bottom hydraulic reversible plough. Compatible with >40HP tractors.',
                    pricePerHour: 50,
                    pricePerDay: 400,
                    location: 'Ludhiana, Punjab',
                    images: ['/uploads/plough1.jpg'],
                    isAvailable: true,
                    owner: ownerId,
                },
            ];

            await Equipment.create(equipmentList);
            console.log('Seeding completed successfully');
        } catch (error) {
            console.error('Seeding failed:', error);
        }
    }

    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
