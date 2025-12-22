import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase URL or Anon Key. Please check your .env file.")
    // Return a dummy object to prevent immediate crash, functionality will obviously fail but UI renders
    supabaseInstance = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ error: { message: "Supabase keys missing. Check console." } }),
            signUp: () => Promise.resolve({ error: { message: "Supabase keys missing. Check console." } }),
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
