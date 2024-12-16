declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALLOWED_ORIGINS?: string
      NODE_ENV: 'development' | 'production' | 'test'
      // Add other environment variables used in the frontend API
    }
  }
}

export {}
