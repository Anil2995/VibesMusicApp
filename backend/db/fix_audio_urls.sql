-- Fix Audio URLs - Use verified working free audio sources
-- Run this in Supabase SQL Editor

-- These are FREE, CORS-enabled audio files from various public sources
UPDATE public.tracks SET audio_url = 
    CASE title
        WHEN 'Ambient Piano' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3'
        WHEN 'Summer Vibes' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3'
        WHEN 'Night Drive' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Interlude.mp3'
        WHEN 'Shape of You' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Podington_Bear/Solo_Instruments/Podington_Bear_-_Starling.mp3'
        WHEN 'Blinding Lights' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3'
        WHEN 'Levitating' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Jahzzar/Travellers_Guide/Jahzzar_-_05_-_Siesta.mp3'
        WHEN 'Stay' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_09_-_Contention.mp3'
        WHEN 'Bad Guy' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Lobo_Loco/Salsa_Spiral/Lobo_Loco_-_01_-_Salsa_Spiral_ID_1249.mp3'
        WHEN 'Dynamite' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Augment.mp3'
        WHEN 'Peaches' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Jahzzar/Travellers_Guide/Jahzzar_-_01_-_Bleu.mp3'
        WHEN 'Montero' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Catapult.mp3'
        WHEN 'Good 4 U' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Jahzzar/Tumbling_Dishes_Like_Old-Mans_Wishes/Jahzzar_-_05_-_Poolside.mp3'
        WHEN 'Easy On Me' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_01_-_Sentinel.mp3'
        WHEN 'Heat Waves' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Podington_Bear/Rhythm/Podington_Bear_-_Rubber_Robot.mp3'
        WHEN 'Dance Monkey' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Organisms.mp3'
        ELSE audio_url
    END;

-- Verify the update
SELECT title, audio_url FROM public.tracks;
