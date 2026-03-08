// This file MUST be imported first before any other module
// so environment variables are loaded before any module-level code runs.

// Vercel supplies env vars, but during development you can still use a .env file
try {
    const dotenv = require('dotenv');
    dotenv.config();
} catch (error) {
    console.log('dotenv not available, using environment vars directly');
}
