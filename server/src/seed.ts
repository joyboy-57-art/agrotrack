import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Equipment } from './models/Equipment';
import { Booking } from './models/Booking';

dotenv.config();

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
    },
];

const importData = async () => {
    try {
        await connectDB();

        await Booking.deleteMany();
        await Equipment.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);

        // Assign Ramesh as the owner of all items
        const ownerUser = createdUsers[1]._id;

        const sampleEquipment = equipmentList.map((item) => {
            return { ...item, owner: ownerUser };
        });

        await Equipment.insertMany(sampleEquipment);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroy data logic if needed
} else {
    importData();
}
