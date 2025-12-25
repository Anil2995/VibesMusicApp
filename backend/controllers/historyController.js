const supabase = require('../config/supabaseClient');

// ============================================
// LISTENING HISTORY & PLAYBACK STATE CONTROLLERS
// Day 9: Recently Played & Resume
// ============================================

// Get recently played tracks for user
const getRecentlyPlayed = async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 20;

        const { data, error } = await supabase
            .from('listening_history')
            .select(`
                id,
                played_at,
                play_duration,
                completed,
                tracks(*)
            `)
            .eq('user_id', userId)
            .order('played_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // Remove duplicates, keep most recent
        const seen = new Set();
        const unique = data.filter(item => {
            if (seen.has(item.tracks?.id)) return false;
            seen.add(item.tracks?.id);
            return true;
        });

        res.json(unique.map(item => ({
            ...item.tracks,
            played_at: item.played_at,
            play_duration: item.play_duration
        })));
    } catch (error) {
        console.error('Error fetching recently played:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Add to listening history
const addToHistory = async (req, res) => {
    try {
        const { user_id, track_id, play_duration, completed } = req.body;

        const { data, error } = await supabase
            .from('listening_history')
            .insert([{
                user_id,
                track_id,
                play_duration: play_duration || 0,
                completed: completed || false
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error adding to history:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get user's playback state (for resume)
const getPlaybackState = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('playback_state')
            .select(`
                *,
                tracks(*),
                playlists(*)
            `)
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

        if (!data) {
            return res.json(null);
        }

        res.json({
            track: data.tracks,
            playlist: data.playlists,
            position: data.position,
            volume: data.volume,
            isShuffled: data.is_shuffled,
            repeatMode: data.repeat_mode
        });
    } catch (error) {
        console.error('Error fetching playback state:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Save playback state
const savePlaybackState = async (req, res) => {
    try {
        const { user_id, track_id, position, playlist_id, volume, is_shuffled, repeat_mode } = req.body;

        // Upsert playback state
        const { data, error } = await supabase
            .from('playback_state')
            .upsert({
                user_id,
                track_id,
                position: position || 0,
                playlist_id: playlist_id || null,
                volume: volume || 0.7,
                is_shuffled: is_shuffled || false,
                repeat_mode: repeat_mode || 'none',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error saving playback state:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get liked tracks for user
const getLikedTracks = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('liked_tracks')
            .select(`
                liked_at,
                tracks(*)
            `)
            .eq('user_id', userId)
            .order('liked_at', { ascending: false });

        if (error) throw error;

        res.json(data.map(item => ({
            ...item.tracks,
            liked_at: item.liked_at
        })));
    } catch (error) {
        console.error('Error fetching liked tracks:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Like a track
const likeTrack = async (req, res) => {
    try {
        const { user_id, track_id } = req.body;

        const { data, error } = await supabase
            .from('liked_tracks')
            .insert([{ user_id, track_id }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error liking track:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Unlike a track
const unlikeTrack = async (req, res) => {
    try {
        const { userId, trackId } = req.params;

        const { error } = await supabase
            .from('liked_tracks')
            .delete()
            .eq('user_id', userId)
            .eq('track_id', trackId);

        if (error) throw error;
        res.json({ message: 'Track unliked successfully' });
    } catch (error) {
        console.error('Error unliking track:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Check if track is liked
const isTrackLiked = async (req, res) => {
    try {
        const { userId, trackId } = req.params;

        const { data, error } = await supabase
            .from('liked_tracks')
            .select('id')
            .eq('user_id', userId)
            .eq('track_id', trackId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        res.json({ liked: !!data });
    } catch (error) {
        console.error('Error checking liked status:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRecentlyPlayed,
    addToHistory,
    getPlaybackState,
    savePlaybackState,
    getLikedTracks,
    likeTrack,
    unlikeTrack,
    isTrackLiked
};
