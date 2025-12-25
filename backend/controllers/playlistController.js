const supabase = require('../config/supabaseClient');

// ============================================
// PLAYLIST CONTROLLERS
// ============================================

// Get all playlists for a user
const getUserPlaylists = async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from('playlists')
            .select(`
                *,
                playlist_tracks(count)
            `)
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        // Add track count to each playlist
        const playlists = data.map(p => ({
            ...p,
            track_count: p.playlist_tracks?.[0]?.count || 0
        }));

        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get single playlist with tracks
const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get playlist details
        const { data: playlist, error: playlistError } = await supabase
            .from('playlists')
            .select('*')
            .eq('id', id)
            .single();

        if (playlistError) throw playlistError;

        // Get tracks in playlist
        const { data: tracks, error: tracksError } = await supabase
            .from('playlist_tracks')
            .select(`
                position,
                added_at,
                tracks(*)
            `)
            .eq('playlist_id', id)
            .order('position', { ascending: true });

        if (tracksError) throw tracksError;

        res.json({
            ...playlist,
            tracks: tracks.map(t => ({ ...t.tracks, position: t.position, added_at: t.added_at }))
        });
    } catch (error) {
        console.error('Error fetching playlist:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Create new playlist
const createPlaylist = async (req, res) => {
    try {
        const { name, description, image_url, is_public, user_id } = req.body;

        const { data, error } = await supabase
            .from('playlists')
            .insert([{
                name,
                description: description || '',
                image_url: image_url || null,
                is_public: is_public || false,
                user_id
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating playlist:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Update playlist
const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image_url, is_public } = req.body;

        const { data, error } = await supabase
            .from('playlists')
            .update({
                name,
                description,
                image_url,
                is_public,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating playlist:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete playlist
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('playlists')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.error('Error deleting playlist:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Add track to playlist
const addTrackToPlaylist = async (req, res) => {
    try {
        const { playlistId, trackId } = req.params;

        // Get current max position
        const { data: existing } = await supabase
            .from('playlist_tracks')
            .select('position')
            .eq('playlist_id', playlistId)
            .order('position', { ascending: false })
            .limit(1);

        const nextPosition = existing?.length > 0 ? existing[0].position + 1 : 0;

        const { data, error } = await supabase
            .from('playlist_tracks')
            .insert([{
                playlist_id: playlistId,
                track_id: trackId,
                position: nextPosition
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error adding track to playlist:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Remove track from playlist
const removeTrackFromPlaylist = async (req, res) => {
    try {
        const { playlistId, trackId } = req.params;

        const { error } = await supabase
            .from('playlist_tracks')
            .delete()
            .eq('playlist_id', playlistId)
            .eq('track_id', trackId);

        if (error) throw error;
        res.json({ message: 'Track removed from playlist' });
    } catch (error) {
        console.error('Error removing track from playlist:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Reorder tracks in playlist
const reorderPlaylistTracks = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { trackIds } = req.body; // Array of track IDs in new order

        // Update positions
        const updates = trackIds.map((trackId, index) =>
            supabase
                .from('playlist_tracks')
                .update({ position: index })
                .eq('playlist_id', playlistId)
                .eq('track_id', trackId)
        );

        await Promise.all(updates);
        res.json({ message: 'Playlist reordered successfully' });
    } catch (error) {
        console.error('Error reordering playlist:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks
};
