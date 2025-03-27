// AI Service for handling code enhancement features

/**
 * Gets the OpenRouter API key from environment variables
 * In Vite applications, environment variables are accessed via import.meta.env
 * and must be prefixed with VITE_ to be exposed to client-side code
 */
export const getApiKey = (): string => {
  // Access the OpenRouter API key using Vite's environment variable pattern
  let apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  // GitHub Pages workaround - hardcoded key or window object lookup if available
  // For GitHub Pages deployment which doesn't support server environment variables
  if (!apiKey || apiKey === 'your-new-openrouter-api-key-here') {
    // Try to get from window._env_ if it exists (can be set in index.html)
    if (typeof window !== 'undefined' && window._env_ && window._env_.OPENROUTER_API_KEY) {
      apiKey = window._env_.OPENROUTER_API_KEY;
    } else {
      // Fallback to a constant (remove in production or use only for testing)
      apiKey = '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';
    }
  }
  
  if (!apiKey) {
    // It's better to show a user-friendly message or disable the feature
    // instead of throwing an error that might crash the app.
    // Consider handling this case gracefully in the UI.
    console.warn('API key not found. Please check your environment variables.');
    // Return an empty string or handle appropriately elsewhere
    return ''; 
    // Or: throw new Error('API key not found. Please check your environment variables.');
  }
  
  return apiKey;
};

/**
 * Initializes the AI client with the OpenRouter API key
 */
export const initializeAiClient = () => {
  const apiKey = getApiKey();
  
  // Return configuration with the OpenRouter API key
  return {
    apiKey,
    // Add other configuration options as needed
  };
};

/**
 * Enhances code using the OpenRouter API
 * @param code The code to enhance
 * @param options Additional options for the enhancement
 */
export const enhanceCode = async (code: string, options = {}) => {
  try {
    const config = initializeAiClient();
    
    // Ensure the key is available before making the call
    if (!config.apiKey) {
      console.error('OpenRouter API key is missing. Cannot enhance code.');
      // Optionally, inform the user via UI
      throw new Error('API key is not configured.');
    }

    // Implementation using OpenRouter API
    // Replace with your actual implementation
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': window.location.origin, // OpenRouter requires this for attribution
      },
      body: JSON.stringify({
        model: 'openai/gpt-4', // Or whichever model you're using
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that enhances code.'
          },
          {
            role: 'user',
            content: `Enhance this code: ${code}`
          }
        ],
        ...options
      })
    });
    
    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error enhancing code:', error);
    throw error;
  }
}; 