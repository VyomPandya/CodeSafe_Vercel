/// <reference types="vite/client" />

interface Window {
  _env_?: {
    OPENROUTER_API_KEY?: string;
    [key: string]: string | undefined;
  };
}
