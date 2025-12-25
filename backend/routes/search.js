const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Global search
router.get('/', searchController.globalSearch);

// Search tracks
router.get('/tracks', searchController.searchTracks);

// Search podcasts
router.get('/podcasts', searchController.searchPodcasts);

// Search suggestions (autocomplete)
router.get('/suggestions', searchController.getSearchSuggestions);

module.exports = router;
