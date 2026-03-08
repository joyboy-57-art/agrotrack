// This file MUST be imported first before any other module
// so environment variables are loaded before any module-level code runs.

try {
    const dotenv = await import('dotenv');
    dotenv.default.config();
} catch (error) {
    // dotenv not available in production, environment variables should be set by Render
    console.log('Using environment variables from Render (dotenv not loaded)');
}
