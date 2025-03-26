import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/', // Default base path
    
    // Add this to ensure environment variables are properly processed
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.VITE_OPENROUTER_API_KEY),
      'process.env.OPENROUTER_API_KEY': JSON.stringify(process.env.VITE_OPENROUTER_API_KEY),
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENROUTER_API_KEY)
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
      }
    }
  }

  // Set base path only for production build, matching your repo name
  if (command === 'build') {
    config.base = '/CodeSafe/' // <-- Replace 'CodeSafe' with your actual repository name
  }

  return config
}) 