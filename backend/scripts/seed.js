const seedData = require('../db/seed_data.json');
const supabase = require('../config/supabaseClient');

const seedTracks = async () => {
    console.log('Seeding tracks...');
    const { error } = await supabase.from('tracks').insert(seedData);
    if (error) {
        console.error('Error seeding tracks:', error.message);
    } else {
        console.log('Tracks seeded successfully!');
    }
};

seedTracks();
