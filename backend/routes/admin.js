const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes for content management
router.post('/tracks', adminController.uploadTrack);
router.post('/tracks/bulk', adminController.bulkUploadTracks);
router.put('/tracks/:id', adminController.updateTrack);
router.delete('/tracks/:id', adminController.deleteTrack);
router.get('/stats', adminController.getStorageStats);

module.exports = router;
