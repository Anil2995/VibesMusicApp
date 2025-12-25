const supabase = require('../config/supabaseClient');

// ============================================
// SEARCH CONTROLLER
// Day 11: Search Functionality
// ============================================

// Search tracks
const searchTracks = async (req, res) => {
    try {
        const { q, genre, limit = 20 } = req.query;

        let query = supabase
            .from('tracks')
            .select('*')
            .limit(parseInt(limit));

        if (q) {
            query = query.or(`title.ilike.%${q}%,artist.ilike.%${q}%,album.ilike.%${q}%`);
        }

        if (genre) {
            query = query.eq('genre', genre);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error searching tracks:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Search podcasts
const searchPodcasts = async (req, res) => {
    try {
        const { q, category, limit = 20 } = req.query;

        let query = supabase
            .from('podcasts')
            .select('*')
            .limit(parseInt(limit));

        if (q) {
            query = query.or(`title.ilike.%${q}%,host.ilike.%${q}%,description.ilike.%${q}%`);
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error searching podcasts:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Global search (tracks + podcasts)
const globalSearch = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({ tracks: [], podcasts: [], episodes: [] });
        }

        // Search tracks
        const { data: tracks, error: tracksError } = await supabase
            .from('tracks')
            .select('*')
            .or(`title.ilike.%${q}%,artist.ilike.%${q}%,album.ilike.%${q}%`)
            .limit(parseInt(limit));

        if (tracksError) throw tracksError;

        // Search podcasts
        const { data: podcasts, error: podcastsError } = await supabase
            .from('podcasts')
            .select('*')
            .or(`title.ilike.%${q}%,host.ilike.%${q}%`)
            .limit(parseInt(limit));

        // Search episodes
        let episodes = [];
        try {
            const { data: episodesData, error: episodesError } = await supabase
                .from('episodes')
                .select(`
                    *,
                    podcasts(title, image_url)
                `)
                .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
                .limit(parseInt(limit));

            if (!episodesError) {
                episodes = episodesData || [];
            }
        } catch (e) {
            // Episodes table might not exist
        }

        res.json({
            tracks: tracks || [],
            podcasts: podcasts || [],
            episodes
        });
    } catch (error) {
        console.error('Error in global search:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get search suggestions (autocomplete)
const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        // Get unique artists and track titles
        const { data: tracks } = await supabase
            .from('tracks')
            .select('title, artist')
            .or(`title.ilike.%${q}%,artist.ilike.%${q}%`)
            .limit(10);

        const suggestions = new Set();
        tracks?.forEach(t => {
            if (t.title.toLowerCase().includes(q.toLowerCase())) {
                suggestions.add(t.title);
            }
            if (t.artist.toLowerCase().includes(q.toLowerCase())) {
                suggestions.add(t.artist);
            }
        });

        res.json([...suggestions].slice(0, 8));
    } catch (error) {
        console.error('Error getting suggestions:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    searchTracks,
    searchPodcasts,
    globalSearch,
    getSearchSuggestions
};
