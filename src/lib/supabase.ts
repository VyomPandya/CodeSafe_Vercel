import { createClient } from '@supabase/supabase-js';

// Add debugging to see what values are actually being used
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT SET');
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET');

// Use environment variables with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Add validation
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not properly configured!', {
    url: supabaseUrl ? 'Set' : 'Not set',
    key: supabaseAnonKey ? 'Set' : 'Not set'
  });
}

// Add specific options to handle browser environments
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// Determine if the URL has auth parameters
export const hasAuthParams = () => {
  if (typeof window === 'undefined') return false;
  
  // Check both hash and query parameters for auth tokens
  const hash = window.location.hash;
  return hash.includes('access_token') || 
         hash.includes('refresh_token') || 
         hash.includes('type=recovery') || 
         hash.includes('type=signup');
};

// Safe getter function with fallback for dev mode
export function getSupabaseClient() {
  if (!supabase) {
    // Instead of throwing an error, we'll provide a mock client for dev mode
    if (import.meta.env.DEV && window.location.href.includes('devMode=true')) {
      console.warn('Using mock Supabase client in dev mode');
      // Return a minimally viable mock to prevent errors
      return {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signOut: async () => ({ error: null }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              order: () => ({
                then: (callback: Function) => callback({ data: [], error: null }),
              }),
            }),
          }),
          insert: () => ({
            then: (callback: Function) => callback({ error: null }),
          }),
        }),
      } as any;
    }
    
    // In production, throw a clear error
    throw new Error(
      'Supabase client not initialized. Please check your environment variables and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.'
    );
  }
  
  return supabase;
}

// Instead, export a proxy object that always uses getSupabaseClient()
export const supabaseProxy = new Proxy({} as ReturnType<typeof createClient>, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    return client[prop as keyof typeof client];
  }
});