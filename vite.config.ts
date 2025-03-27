import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())

  const config = {
    plugins: [react()],
    base: '/', // Default base path
    
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
    define: {
      'window._env_': {
        OPENROUTER_API_KEY: JSON.stringify(env.VITE_OPENROUTER_API_KEY || '')
      }
    }
  }

  // Set base path only for production build, matching your repo name
  if (command === 'build') {
    config.base = '/CodeSafe/' // <-- Replace 'CodeSafe' with your actual repository name
  }

  return config
}) 