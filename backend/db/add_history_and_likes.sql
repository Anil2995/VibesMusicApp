-- Create table for listening history (Recently Played)
CREATE TABLE IF NOT EXISTS public.listening_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id uuid REFERENCES public.tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    play_duration INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false
);

-- Create table for liked tracks
CREATE TABLE IF NOT EXISTS public.liked_tracks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id uuid REFERENCES public.tracks(id) ON DELETE CASCADE,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, track_id)
);

-- Enable Row Level Security
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_tracks ENABLE ROW LEVEL SECURITY;

-- Policies for listening_history
CREATE POLICY "Users can view own history" ON listening_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own history" ON listening_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for liked_tracks
CREATE POLICY "Users can view own likes" ON liked_tracks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can like tracks" ON liked_tracks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike tracks" ON liked_tracks FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listening_history_user ON public.listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_played_at ON public.listening_history(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_liked_tracks_user ON public.liked_tracks(user_id);
