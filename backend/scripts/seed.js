const seedData = require('../db/seed_data.json');
const supabase = require('../config/supabaseClient');

const seedTracks = async () => {
    console.log('🎵 Vibes Music App - Seed Script');
    console.log('================================\n');

    // First, clear existing tracks (optional - for fresh seeding)
    console.log('🗑️  Clearing existing tracks...');
    const { error: deleteError } = await supabase.from('tracks').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.log('⚠️  Could not clear tracks (may be empty):', deleteError.message);
    } else {
        console.log('✅ Existing tracks cleared');
    }

    // Insert new seed data
    console.log(`\n📀 Inserting ${seedData.length} tracks...`);
    const { data, error } = await supabase.from('tracks').insert(seedData).select();

    if (error) {
        console.error('❌ Error seeding tracks:', error.message);
    } else {
        console.log('✅ Tracks seeded successfully!\n');
        console.log('📋 Seeded tracks:');
        data.forEach((track, i) => {
            console.log(`   ${i + 1}. "${track.title}" by ${track.artist} [${track.genre}]`);
        });
        console.log(`\n🎉 Total: ${data.length} tracks added!`);
    }

    process.exit(0);
};

seedTracks();
