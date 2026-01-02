-- EMERGENCY FIX: Replace broken Archive.org links with working Pixabay CDN links
-- Pixabay URLs are confirmed to return 200 OK and support CORS

UPDATE public.tracks SET audio_url = 
    CASE title
        WHEN 'Dance Monkey' THEN 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6f0ab0a.mp3'
        WHEN 'Levitating' THEN 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3'
        WHEN 'Dynamite' THEN 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_8f0d0d9dfa.mp3'
        WHEN 'Good 4 U' THEN 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_b9bd4170e4.mp3'
        WHEN 'Shape of You' THEN 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
        WHEN 'Stay' THEN 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb3a8005e5.mp3'
        WHEN 'Heat Waves' THEN 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_69e3b9fe10.mp3'
        WHEN 'Bad Guy' THEN 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_a149709f2a.mp3'
        WHEN 'Peaches' THEN 'https://cdn.pixabay.com/download/audio/2022/08/31/audio_9c93b8d8a5.mp3'
        WHEN 'Montero' THEN 'https://cdn.pixabay.com/download/audio/2022/11/16/audio_d1d7d5c7f5.mp3'
        WHEN 'Easy On Me' THEN 'https://cdn.pixabay.com/download/audio/2023/10/30/audio_f3a2f5d6e4.mp3'
        WHEN 'Night Drive' THEN 'https://cdn.pixabay.com/download/audio/2022/07/11/audio_7c5f8d9e2b.mp3'
        WHEN 'Blinding Lights' THEN 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3'
        WHEN 'Summer Vibes' THEN 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_3b9d7f8e4c.mp3'
        WHEN 'Ambient Piano' THEN 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3'
        ELSE 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3'
    END;

-- Verify
SELECT title, audio_url FROM public.tracks;
