import { createClient } from '@supabase/supabase-js';

// Try to get Supabase environment variables from different sources
// First try Vite's environment variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug variable source
console.log('Supabase URL from import.meta.env:', supabaseUrl ? 'Available' : 'Not available');
console.log('Supabase Anon Key from import.meta.env:', supabaseAnonKey ? 'Available' : 'Not available');

// Add debug object to window for inspection
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__SUPABASE_ENV_DEBUG__ = {
    env_sources: {
      vite_url: import.meta.env.VITE_SUPABASE_URL ? 'Available' : 'Not available',
      vite_key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Available' : 'Not available',
      window_env_url: (typeof window !== 'undefined' && window._env_ && window._env_.SUPABASE_URL) ? 'Available' : 'Not available',
      window_env_key: (typeof window !== 'undefined' && window._env_ && window._env_.SUPABASE_ANON_KEY) ? 'Available' : 'Not available',
    },
    current_url: supabaseUrl ? 'Available' : 'Not available',
    current_key: supabaseAnonKey ? 'Available' : 'Not available',
    site_url: typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'Not available',
    time: new Date().toISOString()
  };
}

// If not available, try window._env_ (GitHub Pages workaround similar to OpenRouter)
if ((!supabaseUrl || !supabaseAnonKey) && typeof window !== 'undefined' && window._env_) {
  if (window._env_.SUPABASE_URL) {
    supabaseUrl = window._env_.SUPABASE_URL;
    console.log('Using Supabase URL from window._env_');
  }
  if (window._env_.SUPABASE_ANON_KEY) {
    supabaseAnonKey = window._env_.SUPABASE_ANON_KEY;
    console.log('Using Supabase Anon Key from window._env_');
  }
}

// Only show error in development environment, not in production to avoid exposing information
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing Supabase environment variables. Check your .env.local file and ensure you have:');
  console.error('VITE_SUPABASE_URL=your-supabase-url');
  console.error('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your GitHub secrets and environment variables.');
}

// Check if env vars are actually valid and not placeholder values
if (supabaseUrl && (supabaseUrl === 'https://your-project-id.supabase.co' || supabaseUrl === '${SUPABASE_URL}')) {
  console.warn('Supabase URL is a placeholder value, not a real URL');
  supabaseUrl = '';
}

if (supabaseAnonKey && (supabaseAnonKey === 'your-anon-key' || supabaseAnonKey === '${SUPABASE_ANON_KEY}')) {
  console.warn('Supabase Anon Key is a placeholder value, not a real key');
  supabaseAnonKey = '';
}

// Debug final values (be careful not to log the entire key)
console.log('Final Supabase URL status:', supabaseUrl ? 'Available' : 'Not available');
console.log('Final Supabase Anon Key status:', supabaseAnonKey ? 'Available' : 'Not available');

// Determine the site URL - use current origin in production or development
// This will be github.io URL in production or localhost in development
const siteUrl = typeof window !== 'undefined' 
  ? window.location.origin + 
    // Handle GitHub Pages path correctly by getting the path from the base element if available
    (document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || 
     // Otherwise use the path from the URL, but remove index.html if present
     window.location.pathname.replace(/\/index\.html$/, ''))
  : '';

// For logging in development
if (import.meta.env.DEV) {
  console.log('Development mode - using site URL:', siteUrl);
}

// Check if we're handling an auth token in the URL
const hasAuthParams = () => {
  if (typeof window === 'undefined') return false;
  
  // Check both hash and query parameters for auth tokens
  const hash = window.location.hash;
  const search = window.location.search;
  
  return hash.includes('access_token') || 
         hash.includes('refresh_token') || 
         hash.includes('type=recovery') || 
         hash.includes('type=signup') ||
         search.includes('access_token') ||
         search.includes('refresh_token');
};

// Log debug info
if (typeof window !== 'undefined') {
  console.log('Current URL:', window.location.href);
  console.log('Has auth params:', hasAuthParams());
  if (window._env_) {
    console.log('Found window._env_ variables');
    // Check if they have values or are just empty objects
    console.log('window._env_ has SUPABASE_URL:', window._env_.SUPABASE_URL ? 'Yes' : 'No');
    console.log('window._env_ has SUPABASE_ANON_KEY:', window._env_.SUPABASE_ANON_KEY ? 'Yes' : 'No');
  }
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

// If supabase client creation failed, log it
if (!supabase) {
  console.error('Failed to create Supabase client due to missing configuration');
}

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