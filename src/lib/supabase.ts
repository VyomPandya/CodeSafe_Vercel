import { createClient } from '@supabase/supabase-js';

// Get Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize a global variable to store the client
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Initialize the Supabase client with proper error handling
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Log a warning without stopping execution
    console.warn('Missing Supabase credentials. Authentication features will not work.');
    
    if (import.meta.env.DEV) {
      console.warn('Make sure you have added the following to your .env file:');
      console.warn('VITE_SUPABASE_URL=your-supabase-url-here');
      console.warn('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here');
    }
    
    // Leave supabaseClient as null
  } else {
    // Only create the client if we have the required configuration
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // Use PKCE flow for better security with GitHub Pages
      },
    });
    
    // Log for diagnostic purposes
    console.log('Supabase client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Leave supabaseClient as null
}

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
  if (!supabaseClient) {
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
  
  return supabaseClient;
}

// Instead, export a proxy object that always uses getSupabaseClient()
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    return client[prop as keyof typeof client];
  }
});