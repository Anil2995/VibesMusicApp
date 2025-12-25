const supabase = require('../config/supabaseClient');
const fs = require('fs');
const path = require('path');

// ============================================
// ADMIN CONTROLLER - Day 10
// Upload and manage content
// ============================================

// Upload track metadata (audio files handled separately via Supabase Storage)
const uploadTrack = async (req, res) => {
    try {
        const { title, artist, album, genre, duration, audio_url, image_url } = req.body;

        const { data, error } = await supabase
            .from('tracks')
            .insert([{
                title,
                artist,
                album: album || null,
                genre: genre || 'Other',
                duration: duration || 0,
                audio_url,
                image_url
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error uploading track:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Bulk upload tracks
const bulkUploadTracks = async (req, res) => {
    try {
        const { tracks } = req.body;

        if (!Array.isArray(tracks) || tracks.length === 0) {
            return res.status(400).json({ error: 'Tracks array is required' });
        }

        const { data, error } = await supabase
            .from('tracks')
            .insert(tracks)
            .select();

        if (error) throw error;
        res.status(201).json({ uploaded: data.length, tracks: data });
    } catch (error) {
        console.error('Error bulk uploading:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete track
const deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('tracks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Track deleted successfully' });
    } catch (error) {
        console.error('Error deleting track:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Update track
const updateTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('tracks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating track:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get storage stats
const getStorageStats = async (req, res) => {
    try {
        const { data: tracks } = await supabase.from('tracks').select('id');
        const { data: podcasts } = await supabase.from('podcasts').select('id');
        const { data: playlists } = await supabase.from('playlists').select('id');

        res.json({
            tracks: tracks?.length || 0,
            podcasts: podcasts?.length || 0,
            playlists: playlists?.length || 0
        });
    } catch (error) {
        console.error('Error getting stats:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    uploadTrack,
    bulkUploadTracks,
    deleteTrack,
    updateTrack,
    getStorageStats
};
