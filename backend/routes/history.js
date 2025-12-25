const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Recently played
router.get('/recent/:userId', historyController.getRecentlyPlayed);
router.post('/recent', historyController.addToHistory);

// Playback state (resume)
router.get('/playback/:userId', historyController.getPlaybackState);
router.post('/playback', historyController.savePlaybackState);

// Liked tracks
router.get('/liked/:userId', historyController.getLikedTracks);
router.post('/liked', historyController.likeTrack);
router.delete('/liked/:userId/:trackId', historyController.unlikeTrack);
router.get('/liked/:userId/:trackId/check', historyController.isTrackLiked);

module.exports = router;
