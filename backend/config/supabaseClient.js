require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Accept both SUPABASE_KEY and SUPABASE_ANON_KEY for flexibility
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

const isValidKey = (key) => key && typeof key === 'string' && key.startsWith('eyJ');

if (!supabaseUrl || !isValidKey(supabaseKey)) {
    console.error("ERROR: Supabase URL or Key missing or invalid in environment variables.");
    console.error("SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
    if (!supabaseKey) console.error("SUPABASE_KEY/ANON_KEY: MISSING");
    else if (!isValidKey(supabaseKey)) console.error("SUPABASE_KEY/ANON_KEY: INVALID FORMAT (Should start with 'eyJ')");
}

const supabase = supabaseUrl && isValidKey(supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

module.exports = supabase;
