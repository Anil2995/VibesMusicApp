const supabase = require('../config/supabaseClient');
const podcasts = require('../db/podcasts_seed.json');

async function seedPodcasts() {
    console.log('🎙️  Starting podcast seeding...');

    try {
        // Clear existing data
        console.log('Clearing existing podcasts and episodes...');
        await supabase.from('podcast_episodes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('podcasts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // Insert podcasts
        for (const podcastData of podcasts) {
            const { episodes, ...podcast } = podcastData;

            console.log(`📻 Inserting podcast: ${podcast.title}`);

            const { data: insertedPodcast, error: podcastError } = await supabase
                .from('podcasts')
                .insert([{
                    title: podcast.title,
                    host: podcast.host,
                    description: podcast.description,
                    category: podcast.category,
                    image_url: podcast.image_url
                }])
                .select()
                .single();

            if (podcastError) {
                console.error(`Error inserting podcast ${podcast.title}:`, podcastError);
                continue;
            }

            // Insert episodes
            if (episodes && episodes.length > 0) {
                for (const episode of episodes) {
                    console.log(`  📝 Adding episode: ${episode.title}`);

                    const { error: episodeError } = await supabase
                        .from('podcast_episodes')
                        .insert([{
                            podcast_id: insertedPodcast.id,
                            title: episode.title,
                            description: episode.description,
                            duration: episode.duration,
                            audio_url: episode.audio_url,
                            video_url: episode.video_url || null,
                            thumbnail_url: episode.thumbnail_url || null,
                            episode_number: episode.episode_number
                        }]);

                    if (episodeError) {
                        console.error(`Error inserting episode ${episode.title}:`, episodeError);
                    }
                }
            }
        }

        console.log('\n✅ Podcast seeding completed successfully!');
        console.log(`📊 Seeded ${podcasts.length} podcasts`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seedPodcasts();
