const supabase = require('../config/supabaseClient');

// Get all podcasts
const getAllPodcasts = async (req, res) => {
    try {
        const { data: podcasts, error } = await supabase
            .from('podcasts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(podcasts);
    } catch (error) {
        console.error('Error fetching podcasts:', error.message);
        res.status(500).json({ error: 'Failed to fetch podcasts' });
    }
};

// Get podcast by ID with episodes
const getPodcastById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get podcast
        const { data: podcast, error: podcastError } = await supabase
            .from('podcasts')
            .select('*')
            .eq('id', id)
            .single();

        if (podcastError) throw podcastError;

        // Get episodes for this podcast
        const { data: episodes, error: episodesError } = await supabase
            .from('podcast_episodes')
            .select('*')
            .eq('podcast_id', id)
            .order('episode_number', { ascending: true });

        if (episodesError) throw episodesError;

        res.json({ ...podcast, episodes });
    } catch (error) {
        console.error('Error fetching podcast:', error.message);
        res.status(500).json({ error: 'Failed to fetch podcast' });
    }
};

// Get all episodes for a podcast
const getEpisodesByPodcastId = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: episodes, error } = await supabase
            .from('podcast_episodes')
            .select('*')
            .eq('podcast_id', id)
            .order('episode_number', { ascending: true });

        if (error) throw error;

        res.json(episodes);
    } catch (error) {
        console.error('Error fetching episodes:', error.message);
        res.status(500).json({ error: 'Failed to fetch episodes' });
    }
};

// Create podcast (for seeding)
const createPodcast = async (req, res) => {
    try {
        const { title, host, description, category, image_url, episodes } = req.body;

        // Insert podcast
        const { data: podcast, error: podcastError } = await supabase
            .from('podcasts')
            .insert([{ title, host, description, category, image_url }])
            .select()
            .single();

        if (podcastError) throw podcastError;

        // Insert episodes if provided
        if (episodes && episodes.length > 0) {
            const episodesData = episodes.map(ep => ({
                ...ep,
                podcast_id: podcast.id
            }));

            const { error: episodesError } = await supabase
                .from('podcast_episodes')
                .insert(episodesData);

            if (episodesError) throw episodesError;
        }

        res.status(201).json(podcast);
    } catch (error) {
        console.error('Error creating podcast:', error.message);
        res.status(500).json({ error: 'Failed to create podcast' });
    }
};

// Get podcasts by category
const getPodcastsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const { data: podcasts, error } = await supabase
            .from('podcasts')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(podcasts);
    } catch (error) {
        console.error('Error fetching podcasts by category:', error.message);
        res.status(500).json({ error: 'Failed to fetch podcasts' });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const { data: podcasts, error } = await supabase
            .from('podcasts')
            .select('category');

        if (error) throw error;

        const categories = [...new Set(podcasts.map(p => p.category))];
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

module.exports = {
    getAllPodcasts,
    getPodcastById,
    getEpisodesByPodcastId,
    createPodcast,
    getPodcastsByCategory,
    getCategories
};
