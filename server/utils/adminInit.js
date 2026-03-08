import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const ensureAdminExists = async () => {
    try {
        const adminEmail = 'viveklawrence11@gmail.com';
        const existingAdmin = await User.findByEmail(adminEmail);

        if (!existingAdmin) {
            console.log('👷 Admin account missing. Creating default admin...');

            // Password 'viveks' will be hashed inside User.create
            await User.create(
                'Vivek Lawrence',
                adminEmail,
                'viveks',
                'admin',
                '9876543210'
            );

            console.log('✅ Default admin account created successfully.');
        } else {
            console.log('✅ Admin account already exists.');
        }
    } catch (error) {
        console.error('❌ Error initializing admin account:', error.message);
    }
};
