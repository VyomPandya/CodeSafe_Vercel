import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
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
    }
  }

  // Set base path only for production build, matching your repo name
  if (command === 'build') {
    config.base = '/CodeSafe/' // <-- Replace 'CodeSafe' with your actual repository name
  }

  return config
}) 