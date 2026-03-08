import pool from '../config/db.js';

const OTP = {
    saveOTP: async (email, otp) => {
        // Expire in 10 minutes (per user request)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)',
            [email, otp, expiresAt]
        );
        return { email, otp, expiresAt };
    },

    verifyOTP: async (email, entered_otp) => {
        const [rows] = await pool.query(
            'SELECT * FROM otps WHERE email = ? AND otp = ? AND is_used = FALSE ORDER BY created_at DESC LIMIT 1',
            [email, entered_otp]
        );

        if (rows.length > 0) {
            // Check if expired
            if (new Date(rows[0].expires_at) < new Date()) {
                return { status: 'expired' };
            }

            // Mark OTP as used
            await pool.query('UPDATE otps SET is_used = TRUE WHERE id = ?', [rows[0].id]);
            return { status: 'valid' };
        }

        return { status: 'invalid' };
    },

    // Optional: Delete OTP after successful password reset
    deleteOTP: async (email) => {
        await pool.query('DELETE FROM otps WHERE email = ?', [email]);
    }
};

export default OTP;
