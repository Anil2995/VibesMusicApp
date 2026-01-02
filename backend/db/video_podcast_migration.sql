-- Video Podcast Migration Script for Vibes Music App
-- Run this in your Supabase SQL Editor to enable video podcasts

-- Add video_url column to episodes table (optional, for video podcasts)
ALTER TABLE public.episodes 
ADD COLUMN IF NOT EXISTS video_url text;

-- Add thumbnail_url column to episodes table (optional, for video thumbnails)
ALTER TABLE public.episodes 
ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'episodes' 
AND column_name IN ('video_url', 'thumbnail_url');

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Video podcast columns added successfully!';
END $$;
