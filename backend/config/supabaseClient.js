require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Accept both SUPABASE_KEY and SUPABASE_ANON_KEY for flexibility
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("ERROR: Supabase URL or Key missing in environment variables.");
    console.error("SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
    console.error("SUPABASE_KEY:", supabaseKey ? "SET" : "MISSING");
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

module.exports = supabase;
