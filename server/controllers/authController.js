import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const register = async (req, res) => {
    try {
        const { name, email, password, role, mobile_number } = req.body;

        const userExists = await User.findByEmail(email);
        if (userExists) return res.status(400).json({ message: 'User already exists with this email' });

        let cleanMobileNumber = null;
        if (mobile_number) {
            // Ensure only digits or + 
            cleanMobileNumber = mobile_number.replace(/[^\d+]/g, '');
        }

        const user = await User.create(name, email, password, 'farmer', cleanMobileNumber);
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            mobile_number: user.mobile_number,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ----- Password Reset via Email OTP -----

export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if user exists (we do this silently to not leak emails, but for standard UX we can just save it or throw error)
        // User requested: "Do not reveal if email exists in system (optional security improvement)"
        // But requested user feedback: "OTP sent to your email."
        // We will just process it if the user exists, but always return success.
        const userExists = await User.findByEmail(email);

        if (userExists) {
            // Save OTP in Database
            await OTP.saveOTP(email, otpCode);

            // Send via Nodemailer
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'AgroTrack Password Reset OTP',
                text: `Your OTP for resetting your AgroTrack password is: ${otpCode}\n\nThis OTP is valid for 10 minutes.`
            };

            await transporter.sendMail(mailOptions);
        }

        // Always return success to prevent email enumeration
        res.status(200).json({ message: 'If that email matches an account, an OTP has been sent.' });

    } catch (error) {
        console.error('Send Reset OTP Error:', error);
        res.status(500).json({ message: 'Failed to process password reset request.' });
    }
};

export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const result = await OTP.verifyOTP(email, otp);

        if (result.status === 'expired') {
            return res.status(400).json({ message: 'OTP expired.' });
        } else if (result.status === 'invalid') {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Valid
        res.status(200).json({ message: 'OTP verified successfully.', email });

    } catch (error) {
        console.error('Verify Reset OTP Error:', error);
        res.status(500).json({ message: 'Failed to verify OTP.' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' }); // Though they verified OTP, just in case
        }

        // We use the existing updateProfile which handles hashing if password is provided
        await User.updateProfile(user.id, {
            name: user.name,
            email: user.email,
            mobile_number: user.mobile_number,
            password: newPassword
        });

        // Cleanup OTP
        await OTP.deleteOTP(email);

        res.status(200).json({ message: 'Password reset successful.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Failed to reset password.' });
    }
};
