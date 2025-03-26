// Make API key globally available 
if (import.meta.env.VITE_OPENROUTER_API_KEY) {
  // Option 1: If your code is looking for window.OPENROUTER_API_KEY
  window.OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  // Option 2: If your code is looking for window.API_KEY
  window.API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  // Option 3: If your code is looking for a common OpenAI key name
  window.OPENAI_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
} 