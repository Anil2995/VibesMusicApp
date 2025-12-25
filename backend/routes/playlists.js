const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

// Get user's playlists
router.get('/user/:userId', playlistController.getUserPlaylists);

// Get single playlist with tracks
router.get('/:id', playlistController.getPlaylistById);

// Create new playlist
router.post('/', playlistController.createPlaylist);

// Update playlist
router.put('/:id', playlistController.updatePlaylist);

// Delete playlist
router.delete('/:id', playlistController.deletePlaylist);

// Add track to playlist
router.post('/:playlistId/tracks/:trackId', playlistController.addTrackToPlaylist);

// Remove track from playlist
router.delete('/:playlistId/tracks/:trackId', playlistController.removeTrackFromPlaylist);

// Reorder tracks in playlist
router.put('/:playlistId/reorder', playlistController.reorderPlaylistTracks);

module.exports = router;
