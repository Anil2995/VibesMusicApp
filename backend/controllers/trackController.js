const supabase = require('../config/supabaseClient');

// Get all tracks
exports.getAllTracks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get track by ID
exports.getTrackById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ error: 'Track not found' });
    }
};

// Seed/Create a track (Admin/Test purpose)
exports.createTrack = async (req, res) => {
    const { title, artist, audio_url, image_url, genre, duration } = req.body;
    try {
        const { data, error } = await supabase
            .from('tracks')
            .insert([{ title, artist, audio_url, image_url, genre, duration }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
