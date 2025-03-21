import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

// Always use the full GitHub Pages URL to ensure consistent redirects
const siteUrl = 'https://vyompandya.github.io/CodeSafe';

// Check if we're handling an auth token in the URL
const hasAuthParams = () => {
  // Check both hash and query parameters for auth tokens
  const hash = window.location.hash;
  return hash.includes('access_token') || 
         hash.includes('refresh_token') || 
         hash.includes('type=recovery') || 
         hash.includes('type=signup');
};

// Log debug info
console.log('Current URL:', window.location.href);
console.log('Has auth params:', hasAuthParams());

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security with GitHub Pages
    site: siteUrl,
    // Don't override the redirectTo here - we'll set it in the Auth component
  }
});

// If we're handling an auth callback, log it
if (hasAuthParams()) {
  console.log('Processing auth callback');
}