import { createClient } from '@supabase/supabase-js';

// Get Supabase environment variables 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only show error in development environment, not in production to avoid exposing information
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing Supabase environment variables. Check your .env.local file and ensure you have:');
  console.error('VITE_SUPABASE_URL=your-supabase-url');
  console.error('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your GitHub secrets and environment variables.');
}

// Determine the site URL - use current origin in production or development
// This will be github.io URL in production or localhost in development
const siteUrl = typeof window !== 'undefined' ? window.location.origin + (window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) : window.location.pathname) : '';

// For logging in development
if (import.meta.env.DEV) {
  console.log('Development mode - using site URL:', siteUrl);
}

// Check if we're handling an auth token in the URL
const hasAuthParams = () => {
  if (typeof window === 'undefined') return false;
  
  // Check both hash and query parameters for auth tokens
  const hash = window.location.hash;
  return hash.includes('access_token') || 
         hash.includes('refresh_token') || 
         hash.includes('type=recovery') || 
         hash.includes('type=signup');
};

// Log debug info
if (typeof window !== 'undefined') {
  console.log('Current URL:', window.location.href);
  console.log('Has auth params:', hasAuthParams());
}

// Create a Supabase client with best-effort handling of missing configurations
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce' // Use PKCE flow for better security with GitHub Pages
      },
      global: {
        headers: { 'x-application-name': 'codesafe-analyzer' }
      }
    })
  : null;

// If we're handling an auth callback, log it
if (hasAuthParams()) {
  console.log('Processing auth callback');
}

// Provide a helpful error function to handle cases where Supabase client is null
export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }
  return supabase;
}