import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config/jwt.js';

const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });

fetch('http://localhost:5000/api/admin/analytics', {
    headers: { Authorization: `Bearer ${token}` }
}).then(async r => {
    console.log(r.status);
    console.log(await r.text());
    process.exit(0);
}).catch(console.error);
