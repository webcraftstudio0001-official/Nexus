/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENROUTER_KEY: string
  readonly VITE_GEMINI_KEY: string
  readonly VITE_NEWS_API_KEY: string
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
