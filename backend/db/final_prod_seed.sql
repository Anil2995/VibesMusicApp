-- UNIQUE AUDIO Seed SQL Generated on 2026-01-02T14:23:21.097Z
-- Uses 26 verified unique audio sources (FMA + SoundHelix) to minimize repetition.
-- Only 4 tracks out of 30 will reuse audio, maximizing variety.

DELETE FROM public.podcast_episodes WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.podcasts WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM public.tracks WHERE id != '00000000-0000-0000-0000-000000000000';

-- Seed Tracks (Max Variety)
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Shape of You',
    'Ed Sheeran',
    '÷ (Divide)',
    'Pop',
    234,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_01_-_Storybook.mp3',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Blinding Lights',
    'The Weeknd',
    'After Hours',
    'Pop',
    200,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_02_-_Happy_Go_Lucky.mp3',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Starboy',
    'The Weeknd ft. Daft Punk',
    'Starboy',
    'Electronic',
    230,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Levitating',
    'Dua Lipa',
    'Future Nostalgia',
    'Pop',
    203,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_05_-_Little_Idea.mp3',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Don''t Start Now',
    'Dua Lipa',
    'Future Nostalgia',
    'Pop',
    183,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_06_-_Clear_Progress.mp3',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Stay',
    'The Kid LAROI & Justin Bieber',
    'F*ck Love 3',
    'Pop',
    141,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3',
    'https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Heat Waves',
    'Glass Animals',
    'Dreamland',
    'Alternative',
    239,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Bad Guy',
    'Billie Eilish',
    'When We All Fall Asleep',
    'Pop',
    194,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Organisms.mp3',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Butter',
    'BTS',
    'Butter',
    'K-Pop',
    165,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3',
    'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Dynamite',
    'BTS',
    'BE',
    'K-Pop',
    199,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Peaches',
    'Justin Bieber',
    'Justice',
    'R&B',
    198,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Montero',
    'Lil Nas X',
    'MONTERO',
    'Hip-Hop',
    137,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Deja Vu',
    'Olivia Rodrigo',
    'SOUR',
    'Pop',
    215,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Good 4 U',
    'Olivia Rodrigo',
    'SOUR',
    'Pop Rock',
    178,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Save Your Tears',
    'The Weeknd',
    'After Hours',
    'Pop',
    215,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Kiss Me More',
    'Doja Cat ft. SZA',
    'Planet Her',
    'R&B',
    208,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://images.unsplash.com/photo-1446329360995-b4642a139973?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Industry Baby',
    'Lil Nas X & Jack Harlow',
    'MONTERO',
    'Hip-Hop',
    212,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Easy On Me',
    'Adele',
    '30',
    'Soul',
    224,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Shivers',
    'Ed Sheeran',
    '=',
    'Pop',
    207,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    'https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Woman',
    'Doja Cat',
    'Planet Her',
    'Pop',
    173,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Happier Than Ever',
    'Billie Eilish',
    'Happier Than Ever',
    'Alternative',
    298,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Take My Breath',
    'The Weeknd',
    'Dawn FM',
    'Electronic',
    219,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Rockin''',
    'The Weeknd',
    'Dawn FM',
    'Pop',
    209,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Cold Heart',
    'Elton John & Dua Lipa',
    'The Lockdown Sessions',
    'Pop',
    203,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Night Drive',
    'Synthwave Boy',
    'Neon Dreams',
    'Electronic',
    245,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Neon Waves',
    'Glass Animals',
    'How To Be A Human Being',
    'Electronic',
    218,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Midnight City',
    'M83',
    'Hurry Up, We''re Dreaming',
    'Electronic',
    243,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_01_-_Storybook.mp3',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Sunset Lover',
    'Petit Biscuit',
    'Presence',
    'Electronic',
    195,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_02_-_Happy_Go_Lucky.mp3',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Sunflower',
    'Post Malone & Swae Lee',
    'Spider-Man: Into the Spider-Verse',
    'Hip-Hop',
    158,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
    'https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=300'
);
INSERT INTO public.tracks (title, artist, album, genre, duration, audio_url, image_url) VALUES (
    'Circles',
    'Post Malone',
    'Hollywood''s Bleeding',
    'Pop',
    215,
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_05_-_Little_Idea.mp3',
    'https://images.unsplash.com/photo-1501612780327-45045538702b?w=300'
);

-- Seed Podcasts and Episodes
INSERT INTO public.podcasts (id, title, host, description, category, image_url) VALUES (
    '9d71131e-57c2-4d65-b942-3a098f76cf90',
    'Tech Talk Daily',
    'Alex Thompson',
    'Your daily dose of tech news, updates, and insightful discussions about the latest in technology, AI, and software development.',
    'Technology',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60'
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '9d71131e-57c2-4d65-b942-3a098f76cf90',
    'The Future of AI in 2024',
    'Exploring how AI will shape our lives and work in the coming year',
    1845,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&auto=format&fit=crop&q=60',
    1
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '9d71131e-57c2-4d65-b942-3a098f76cf90',
    'Web Development Trends',
    'Latest frameworks and tools that are changing the web landscape',
    2100,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&auto=format&fit=crop&q=60',
    2
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '9d71131e-57c2-4d65-b942-3a098f76cf90',
    'Cybersecurity Essentials',
    'Protecting yourself and your business in the digital age',
    1920,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    NULL,
    NULL,
    3
);

INSERT INTO public.podcasts (id, title, host, description, category, image_url) VALUES (
    'fe6890c9-05f6-428c-ada3-20c76ff33b2a',
    'Mindful Moments',
    'Sarah Chen',
    'A meditation and wellness podcast to help you find peace, clarity, and balance in your daily life.',
    'Wellness',
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&auto=format&fit=crop&q=60'
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    'fe6890c9-05f6-428c-ada3-20c76ff33b2a',
    'Morning Meditation Guide',
    'Start your day with clarity and positive energy',
    1200,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60',
    1
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    'fe6890c9-05f6-428c-ada3-20c76ff33b2a',
    'Stress Relief Techniques',
    'Practical methods to reduce anxiety and find calm',
    1500,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    NULL,
    NULL,
    2
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    'fe6890c9-05f6-428c-ada3-20c76ff33b2a',
    'Sleep Better Tonight',
    'Guided relaxation for deeper, more restful sleep',
    1800,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    NULL,
    NULL,
    3
);

INSERT INTO public.podcasts (id, title, host, description, category, image_url) VALUES (
    '28b222a0-d00b-483d-8382-90fa288ba100',
    'Business Builders',
    'Marcus Johnson',
    'Interviews with successful entrepreneurs and business insights to help you build and grow your own venture.',
    'Business',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60'
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '28b222a0-d00b-483d-8382-90fa288ba100',
    'From Startup to Success',
    'Key lessons from founders who made it big',
    2400,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
    1
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '28b222a0-d00b-483d-8382-90fa288ba100',
    'Marketing on a Budget',
    'How to grow your brand without breaking the bank',
    1980,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    NULL,
    NULL,
    2
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '28b222a0-d00b-483d-8382-90fa288ba100',
    'Team Building Secrets',
    'Creating a culture that attracts and retains top talent',
    2200,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    NULL,
    NULL,
    3
);

INSERT INTO public.podcasts (id, title, host, description, category, image_url) VALUES (
    '6baa84c1-46c4-4824-9ab7-99eb5d5bb0be',
    'Music Production Academy',
    'DJ Phoenix',
    'Learn the art of music production, from beat-making to mastering, with tips from industry professionals.',
    'Music',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop&q=60'
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '6baa84c1-46c4-4824-9ab7-99eb5d5bb0be',
    'Beat Making 101',
    'Getting started with creating your first beats',
    1650,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=60',
    1
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '6baa84c1-46c4-4824-9ab7-99eb5d5bb0be',
    'Mixing Like a Pro',
    'Professional mixing techniques for crystal clear sound',
    2100,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60',
    2
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    '6baa84c1-46c4-4824-9ab7-99eb5d5bb0be',
    'Mastering Fundamentals',
    'The final touch to make your tracks radio-ready',
    1800,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    NULL,
    NULL,
    3
);

INSERT INTO public.podcasts (id, title, host, description, category, image_url) VALUES (
    'a8f42173-cb65-4a0d-85ab-beba57ee8876',
    'Comedy Central Live',
    'Mike & Jessica',
    'Hilarious conversations, funny stories, and the best comedy sketches to brighten your day.',
    'Comedy',
    'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&auto=format&fit=crop&q=60'
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    'a8f42173-cb65-4a0d-85ab-beba57ee8876',
    'Office Fails Compilation',
    'The funniest workplace mishaps and stories',
    1500,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://images.unsplash.com/photo-1543965170-4c01a586684e?w=500&auto=format&fit=crop&q=60',
    1
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    'a8f42173-cb65-4a0d-85ab-beba57ee8876',
    'Dating Disasters',
    'Cringe-worthy but hilarious dating stories from listeners',
    1800,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    NULL,
    NULL,
    2
);

INSERT INTO public.podcasts (id, title, host, description, category, image_url) VALUES (
    'e04e7cbd-ad37-4654-9f3e-356d84b60f95',
    'True Crime Files',
    'Detective Noir',
    'Deep dives into mysterious cases, unsolved crimes, and the stories behind them.',
    'True Crime',
    'https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=500&auto=format&fit=crop&q=60'
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    'e04e7cbd-ad37-4654-9f3e-356d84b60f95',
    'The Vanishing Act',
    'A person disappears without a trace - what happened?',
    2700,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60',
    1
);
INSERT INTO public.podcast_episodes (podcast_id, title, description, duration, audio_url, video_url, thumbnail_url, episode_number) VALUES (
    'e04e7cbd-ad37-4654-9f3e-356d84b60f95',
    'Cold Case Chronicles',
    'Revisiting cases that went cold decades ago',
    2400,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    NULL,
    NULL,
    2
);

