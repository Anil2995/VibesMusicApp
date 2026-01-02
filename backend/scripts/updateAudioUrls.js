const supabase = require('../config/supabaseClient');

// Map of old SoundHelix URLs to new Pixabay CDN URLs
const urlUpdates = [
    { old: 'SoundHelix-Song-1.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { old: 'SoundHelix-Song-2.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3' },
    { old: 'SoundHelix-Song-3.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_e8c330ff9d.mp3' },
    { old: 'SoundHelix-Song-4.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3' },
    { old: 'SoundHelix-Song-5.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6f0ab0a.mp3' },
    { old: 'SoundHelix-Song-6.mp3', new: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb3a8005e5.mp3' },
    { old: 'SoundHelix-Song-7.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_69e3b9fe10.mp3' },
    { old: 'SoundHelix-Song-8.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_a149709f2a.mp3' },
    { old: 'SoundHelix-Song-9.mp3', new: 'https://cdn.pixabay.com/download/audio/2023/03/17/audio_aadfc2ed1e.mp3' },
    { old: 'SoundHelix-Song-10.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_8f0d0d9dfa.mp3' },
    { old: 'SoundHelix-Song-11.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/08/31/audio_9c93b8d8a5.mp3' },
    { old: 'SoundHelix-Song-12.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/11/16/audio_d1d7d5c7f5.mp3' },
    { old: 'SoundHelix-Song-13.mp3', new: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_25a4f8b0b5.mp3' },
    { old: 'SoundHelix-Song-14.mp3', new: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_b9bd4170e4.mp3' },
    { old: 'SoundHelix-Song-15.mp3', new: 'https://cdn.pixabay.com/download/audio/2023/05/17/audio_53906e6e7c.mp3' },
    { old: 'SoundHelix-Song-16.mp3', new: 'https://cdn.pixabay.com/download/audio/2023/09/05/audio_a09afd18f4.mp3' },
];

const updateAudioUrls = async () => {
    console.log('🎵 Updating Audio URLs to CORS-supported CDN...\n');

    // Get all tracks
    const { data: tracks, error: fetchError } = await supabase
        .from('tracks')
        .select('id, title, audio_url');

    if (fetchError) {
        console.error('❌ Error fetching tracks:', fetchError.message);
        process.exit(1);
    }

    console.log(`📋 Found ${tracks.length} tracks to update\n`);

    let updated = 0;
    for (const track of tracks) {
        // Find matching URL update
        const urlUpdate = urlUpdates.find(u => track.audio_url && track.audio_url.includes(u.old));

        if (urlUpdate) {
            const { error: updateError } = await supabase
                .from('tracks')
                .update({ audio_url: urlUpdate.new })
                .eq('id', track.id);

            if (updateError) {
                console.error(`❌ Error updating "${track.title}":`, updateError.message);
            } else {
                console.log(`✅ Updated: "${track.title}"`);
                updated++;
            }
        }
    }

    console.log(`\n🎉 Updated ${updated} tracks with CORS-supported audio URLs!`);
    process.exit(0);
};

updateAudioUrls();
