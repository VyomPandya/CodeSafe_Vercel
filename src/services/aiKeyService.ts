export const getStoredApiKey = (): string => {
  return localStorage.getItem('openrouter_api_key') || '';
};

export const setApiKey = (key: string): void => {
  localStorage.setItem('openrouter_api_key', key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem('openrouter_api_key');
}; 