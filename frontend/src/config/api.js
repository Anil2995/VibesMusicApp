// Central API configuration
// In development, use local backend. In production, fallback to deployed API

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// API base URL - prioritize environment variable, then local, then production
export const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (isDevelopment ? 'http://localhost:5000/api' : 'https://vibes-music-api.onrender.com/api');

export default API_BASE_URL;
