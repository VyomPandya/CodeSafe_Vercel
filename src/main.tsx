import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window._env_ is initialized
if (typeof window !== 'undefined') {
  window._env_ = window._env_ || {};
  
  // Log environment status
  if (import.meta.env.DEV) {
    console.log('Development mode - environment variables from import.meta.env will be used');
    
    // Check if we have environment variables
    const hasSupabaseEnv = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    console.log('Supabase environment variables:', hasSupabaseEnv ? 'Available' : 'Missing');
    
    // Check if window._env_ is populated (from env-config.js)
    const hasWindowEnv = window._env_.SUPABASE_URL && window._env_.SUPABASE_ANON_KEY;
    console.log('Window._env_ variables:', hasWindowEnv ? 'Available' : 'Missing');
  } else {
    console.log('Production mode - environment variables from window._env_ will be used if available');
  }
}

// Add a global error handler for uncaught exceptions
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    // Don't show errors in production that might expose sensitive information
    if (import.meta.env.DEV) {
      console.error('Error details:', event);
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
