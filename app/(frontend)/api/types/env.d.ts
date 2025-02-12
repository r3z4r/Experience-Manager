declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALLOWED_ORIGINS?: string
      NODE_ENV: 'development' | 'production' | 'test'
      NEXT_PUBLIC_BASE_PATH: string
      NEXT_PUBLIC_SITE_URL: string
      NEXT_PUBLIC_APP_URL: string
      DATABASE_URI: string
      PAYLOAD_SECRET: string
      // Add other environment variables used in the frontend API
    }
  }
}

export {}
