import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages
  base: '/CodeSafe/',
  
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
}) 