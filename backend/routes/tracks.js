const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

// GET all tracks
router.get('/', trackController.getAllTracks);

// GET single track
router.get('/:id', trackController.getTrackById);

// POST new track (For seeding data basically)
router.post('/', trackController.createTrack);

module.exports = router;
