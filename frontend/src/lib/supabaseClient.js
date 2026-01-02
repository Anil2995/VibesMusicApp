import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null;

const isValidKey = (key) => key && typeof key === 'string' && key.startsWith('eyJ');

if (!supabaseUrl || !isValidKey(supabaseAnonKey)) {
    console.error("Supabase Configuration Error:");
    if (!supabaseUrl) console.error("- Missing VITE_SUPABASE_URL in .env");
    if (!supabaseAnonKey) console.error("- Missing VITE_SUPABASE_ANON_KEY in .env");
    else if (!isValidKey(supabaseAnonKey)) console.error(`- VITE_SUPABASE_ANON_KEY does not look like a valid JWT (should start with 'eyJ'). Found: ${supabaseAnonKey.substring(0, 10)}...`);

    // Return a dummy object to prevent immediate crash, functionality will obviously fail but UI renders
    supabaseInstance = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ error: { message: "Invalid Supabase Configuration. Check console." } }),
            signUp: () => Promise.resolve({ error: { message: "Invalid Supabase Configuration. Check console." } }),
            signOut: () => Promise.resolve({ error: null })
        },
        from: () => ({
            select: () => ({
                order: () => Promise.resolve({ data: [], error: null }),
                eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) })
            })
        })
    }
} else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseInstance
