import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  const config = {
    plugins: [react()],
    base: '/', // Default base path
    define: {
      // Add more comprehensive globals
      'process.env': {},
      'global': 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
      // Explicitly define all environment variables
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')
    },
    
    // Add resolve aliases for browser compatibility
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser',
      }
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion']
    },
    
    // Ensure assets are properly handled
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Copy the 404.html to the build output
      rollupOptions: {
        input: {
          main: 'index.html',
        }
      },
      sourcemap: true
    }
  }

  // Set base path for production
  if (command === 'build') {
    config.base = '/CodeSafe/'
  }

  return config
}) 