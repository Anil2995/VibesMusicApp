-- ============================================
-- PLAYLISTS & LISTENING HISTORY SCHEMA
-- Day 8 & 9: Playlist Feature + Recently Played
-- ============================================

-- Playlists table
CREATE TABLE IF NOT EXISTS public.playlists (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Playlist tracks junction table
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id uuid REFERENCES public.playlists(id) ON DELETE CASCADE,
    track_id uuid REFERENCES public.tracks(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(playlist_id, track_id)
);

-- Recently played / listening history
CREATE TABLE IF NOT EXISTS public.listening_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id uuid REFERENCES public.tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    play_duration INTEGER DEFAULT 0, -- seconds listened
    completed BOOLEAN DEFAULT false
);

-- Resume playback state
CREATE TABLE IF NOT EXISTS public.playback_state (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    track_id uuid REFERENCES public.tracks(id) ON DELETE SET NULL,
    position INTEGER DEFAULT 0, -- seconds
    playlist_id uuid REFERENCES public.playlists(id) ON DELETE SET NULL,
    volume DECIMAL(3,2) DEFAULT 0.7,
    is_shuffled BOOLEAN DEFAULT false,
    repeat_mode TEXT DEFAULT 'none', -- 'none', 'all', 'one'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Liked tracks table
CREATE TABLE IF NOT EXISTS public.liked_tracks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id uuid REFERENCES public.tracks(id) ON DELETE CASCADE,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, track_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_playlists_user ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON public.playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_user ON public.listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_played_at ON public.listening_history(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_liked_tracks_user ON public.liked_tracks(user_id);

-- RLS Policies
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_tracks ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Users can view own playlists" ON playlists FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can create playlists" ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON playlists FOR DELETE USING (auth.uid() = user_id);

-- Playlist tracks policies
CREATE POLICY "Users can view playlist tracks" ON playlist_tracks FOR SELECT USING (true);
CREATE POLICY "Users can add tracks to own playlists" ON playlist_tracks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
);
CREATE POLICY "Users can remove tracks from own playlists" ON playlist_tracks FOR DELETE USING (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
);

-- Listening history policies
CREATE POLICY "Users can view own history" ON listening_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own history" ON listening_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Playback state policies
CREATE POLICY "Users can view own playback state" ON playback_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own playback state" ON playback_state FOR ALL USING (auth.uid() = user_id);

-- Liked tracks policies
CREATE POLICY "Users can view own likes" ON liked_tracks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can like tracks" ON liked_tracks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike tracks" ON liked_tracks FOR DELETE USING (auth.uid() = user_id);

-- Function to update playlist updated_at
CREATE OR REPLACE FUNCTION update_playlist_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE playlists SET updated_at = NOW() WHERE id = NEW.playlist_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for playlist updates
DROP TRIGGER IF EXISTS playlist_track_update ON playlist_tracks;
CREATE TRIGGER playlist_track_update
    AFTER INSERT OR DELETE ON playlist_tracks
    FOR EACH ROW
    EXECUTE FUNCTION update_playlist_timestamp();
