// This file MUST be imported first before any other module
// so environment variables are loaded before any module-level code runs.

import dotenv from 'dotenv';

try {
    // Attempt to load from current directory (.env)
    // If you run node server/server.js from root, it might look in root.
    // If you cd server && npm start, it looks in server.
    dotenv.config();
} catch (error) {
    console.log('dotenv not available, using environment vars directly');
}
