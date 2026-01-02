-- Audio URL Update Migration for Vibes Music App
-- Run this in your Supabase SQL Editor to update audio URLs to CORS-supported CDN
-- This fixes the "no sound" issue on the deployed version

-- Update all tracks to use Pixabay CDN URLs (which support CORS)
UPDATE public.tracks
SET audio_url = CASE 
    WHEN audio_url LIKE '%SoundHelix-Song-1.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-2.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-3.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_e8c330ff9d.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-4.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-5.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6f0ab0a.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-6.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb3a8005e5.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-7.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_69e3b9fe10.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-8.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_a149709f2a.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-9.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2023/03/17/audio_aadfc2ed1e.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-10.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_8f0d0d9dfa.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-11.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/08/31/audio_9c93b8d8a5.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-12.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/11/16/audio_d1d7d5c7f5.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-13.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_25a4f8b0b5.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-14.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_b9bd4170e4.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-15.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2023/05/17/audio_53906e6e7c.mp3'
    WHEN audio_url LIKE '%SoundHelix-Song-16.mp3%' THEN 'https://cdn.pixabay.com/download/audio/2023/09/05/audio_a09afd18f4.mp3'
    ELSE audio_url
END
WHERE audio_url LIKE '%soundhelix.com%';

-- Verify the update
SELECT title, 
       CASE WHEN audio_url LIKE '%pixabay%' THEN '✅ Updated' ELSE '❌ Not Updated' END as status,
       audio_url
FROM public.tracks;
