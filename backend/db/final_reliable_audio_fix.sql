-- FINAL RELIABLE AUDIO FIX
-- Uses ONLY Free Music Archive (FMA) URLs which are verified to work (200 OK)
-- Removes all Pixabay URLs which were returning 403 Forbidden

UPDATE public.tracks SET audio_url = 
    CASE title
        -- Group A: Scott Holmes (Upbeat/Pop)
        WHEN 'Levitating' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_04_-_Upbeat_Party.mp3'
        WHEN 'Blinding Lights' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_01_-_Storybook.mp3'
        WHEN 'Bad Guy' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_02_-_Happy_Go_Lucky.mp3'
        WHEN 'Dynamite' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_05_-_Little_Idea.mp3'
        WHEN 'Shape of You' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_06_-_Clear_Progress.mp3'

        -- Group B: Chad Crouch (Chill/Electronic)
        WHEN 'Stay' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3'
        WHEN 'Peaches' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3'
        WHEN 'Montero' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Organisms.mp3'
        WHEN 'Easy On Me' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_shipping_lanes.mp3' -- Reuse (safe)
        WHEN 'Ambient Piano' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3' -- Reuse (safe)

        -- Group C: Tours & Broke For Free (Alternative)
        WHEN 'Dance Monkey' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3'
        WHEN 'Good 4 U' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' -- Reuse (safe)
        WHEN 'Night Drive' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3'
        WHEN 'Summer Vibes' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3' -- Reuse (safe)
        WHEN 'Heat Waves' THEN 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_04_-_Upbeat_Party.mp3' -- Reuse (safe)

        ELSE 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3'
    END;
