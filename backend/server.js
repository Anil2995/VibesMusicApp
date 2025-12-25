const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Import Routes
const trackRoutes = require('./routes/tracks');
const podcastRoutes = require('./routes/podcasts');
const playlistRoutes = require('./routes/playlists');
const historyRoutes = require('./routes/history');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');

// API Routes
app.use('/api/tracks', trackRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Vibes Music App API is running!',
        version: '2.0.0',
        endpoints: {
            tracks: '/api/tracks',
            podcasts: '/api/podcasts',
            playlists: '/api/playlists',
            history: '/api/history',
            search: '/api/search'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🎵 Vibes Music Server running on port ${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
