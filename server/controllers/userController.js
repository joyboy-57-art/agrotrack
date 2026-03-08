import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user] = await pool.query(
      "SELECT id, name, email, mobile_number FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load profile data" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile_number, changePassword, oldPassword, newPassword } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!name || !email || !mobile_number) {
      return res.status(400).json({ message: 'Name, email, and mobile number are required' });
    }

    //1. Get current user details
    const [currentUser] = await pool.query(
      "SELECT email, mobile_number FROM users WHERE id = ?",
      [userId]
    );

    // 2. Only check duplicates if email or mobile changed
    if (
      email !== currentUser[0].email ||
      mobile_number !== currentUser[0].mobile_number
    ) {
      const [existing] = await pool.query(
        "SELECT id FROM users WHERE (email = ? OR mobile_number = ?) AND id != ?",
        [email, mobile_number, userId]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          message: "Email or mobile number already in use"
        });
      }
    }

    const dataToUpdate = { name, email, mobile_number };

    // 2. Optional password change logic
    if (changePassword) {
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }

      const currentHashedPassword = await User.getPasswordById(userId);
      const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);

      if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
      dataToUpdate.password = newPassword;
    }

    // 3. Run the update
    const updatedUser = await User.updateProfile(userId, dataToUpdate);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile_number: updatedUser.mobile_number,
        role: req.user.role // Role doesn't change here
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
