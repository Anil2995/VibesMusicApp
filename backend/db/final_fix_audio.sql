-- Fix Audio URLs - Final Reliable Version
-- Uses Archive.org direct links which are known to be stable and CORS-enabled

UPDATE public.tracks SET audio_url = 
    CASE title
        -- Pop / High Energy Tracks
        WHEN 'Dance Monkey' THEN 'https://archive.org/download/mythium/JLS_-_01_-_Alone.mp3'
        WHEN 'Levitating' THEN 'https://archive.org/download/mythium/JLS_-_06_-_Stumble.mp3'
        WHEN 'Dynamite' THEN 'https://archive.org/download/mythium/SS_-_02_-_Sick.mp3'
        WHEN 'Good 4 U' THEN 'https://archive.org/download/mythium/G_-_09_-_Clash.mp3'
        WHEN 'Shape of You' THEN 'https://archive.org/download/mythium/JLS_-_05_-_Glow.mp3'
        
        -- Electronic / Synth Tracks
        WHEN 'Night Drive' THEN 'https://archive.org/download/Action_Rhythms/Action_Rhythms_-_02_-_South_Street.mp3'
        WHEN 'Blinding Lights' THEN 'https://archive.org/download/Action_Rhythms/Action_Rhythms_-_05_-_Wire_and_Flashing_Lights.mp3'
        WHEN 'Summer Vibes' THEN 'https://archive.org/download/Action_Rhythms/Action_Rhythms_-_08_-_Hats_Off_To_You_Sire.mp3'
        WHEN 'Heat Waves' THEN 'https://archive.org/download/Action_Rhythms/Action_Rhythms_-_03_-_North_Pool.mp3'
        WHEN 'Bad Guy' THEN 'https://archive.org/download/Action_Rhythms/Action_Rhythms_-_07_-_Running_Through_The_Forest.mp3'
        
        -- Chill / Slow Tracks
        WHEN 'Stay' THEN 'https://archive.org/download/calming-music/Calming%20Music.mp3'
        WHEN 'Peaches' THEN 'https://archive.org/download/Music_For_Relaxation/Music_For_Relaxation_-_01_-_A_Moment.mp3'
        WHEN 'Montero' THEN 'https://archive.org/download/Music_For_Relaxation/Music_For_Relaxation_-_02_-_Reflections.mp3'
        WHEN 'Easy On Me' THEN 'https://archive.org/download/Music_For_Relaxation/Music_For_Relaxation_-_03_-_Drifting.mp3'
        WHEN 'Ambient Piano' THEN 'https://archive.org/download/Music_For_Relaxation/Music_For_Relaxation_-_04_-_Peace.mp3'
        
        -- Default fallback
        ELSE 'https://archive.org/download/testmp3testfile/mpthreetest.mp3'
    END;

-- Verify
SELECT title, audio_url FROM public.tracks;
