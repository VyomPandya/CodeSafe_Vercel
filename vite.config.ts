import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd())

  // Create public directory if it doesn't exist (for development)
  const publicDir = path.resolve(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Create env-config.js in public directory for development
  if (command === 'serve') {
    const envConfigPath = path.resolve(publicDir, 'env-config.js')
    const envConfigContent = `
      // Development environment variables
      window._env_ = window._env_ || {};
      window._env_.SUPABASE_URL = ${JSON.stringify(env.VITE_SUPABASE_URL || '')};
      window._env_.SUPABASE_ANON_KEY = ${JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')};
      window._env_.OPENROUTER_API_KEY = ${JSON.stringify(env.VITE_OPENROUTER_API_KEY || '')};
    `
    fs.writeFileSync(envConfigPath, envConfigContent)
  }

  const config = {
    plugins: [react()],
    base: command === 'build' ? '/CodeSafe/' : '/', // Use repo name in production
    
    // Ensure assets are properly handled
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Copy the 404.html to the build output
      rollupOptions: {
        input: {
          main: 'index.html',
        }
      }
    },
    
    // Configure development server
    server: {
      // Prevent URI malformed errors
      fs: {
        strict: false,
        allow: ['..'] // Allow serving files from one level up
      },
      // Remove the middlewareMode setting
      port: 3000, // Explicitly set port
      host: true  // Listen on all addresses
    },
    
    // Properly handle public directory
    publicDir: 'public',
    
    // Make environment variables available to the client
    define: {
      // Only include env variables that we explicitly want to expose
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(env.VITE_OPENROUTER_API_KEY || '')
    }
  }

  return config
}) 