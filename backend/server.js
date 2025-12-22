const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const trackRoutes = require('./routes/tracks');

// Routes
app.use('/api/tracks', trackRoutes);

app.get('/', (req, res) => {
    res.send('Music App Backend is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
