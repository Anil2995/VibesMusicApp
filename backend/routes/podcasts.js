const express = require('express');
const router = express.Router();
const podcastController = require('../controllers/podcastController');

// GET all podcasts
router.get('/', podcastController.getAllPodcasts);

// GET all categories
router.get('/categories', podcastController.getCategories);

// GET podcast by ID with episodes
router.get('/:id', podcastController.getPodcastById);

// GET episodes for a podcast
router.get('/:id/episodes', podcastController.getEpisodesByPodcastId);

// GET podcasts by category
router.get('/category/:category', podcastController.getPodcastsByCategory);

// POST new podcast (For seeding)
router.post('/', podcastController.createPodcast);

module.exports = router;
