import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'agrotrack',
});

const checkUsers = async () => {
    try {
        const id = 7;
        const email = 'viveklawrence11@gmail.com';
        const mobile = '7671082906';

        console.log(`Simulating duplicate check for UserID: ${id}, Email: ${email}, Mobile: ${mobile}`);

        const [rows] = await pool.query(
            'SELECT id, email, mobile_number FROM users WHERE (email = ? OR mobile_number = ?) AND id != ?',
            [email, mobile, id]
        );

        if (rows.length > 0) {
            console.log('CONFLICTS FOUND:');
            rows.forEach(r => console.log(`Conflicting ID: ${r.id}, Email: ${r.email}, Mobile: ${r.mobile_number}`));
        } else {
            console.log('NO CONFLICTS FOUND.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        process.exit(1);
    }
};

checkUsers();
