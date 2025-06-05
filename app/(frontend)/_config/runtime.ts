/**
 * Runtime configuration for the Experience Manager
 * This file provides runtime configuration values that can be accessed on both client and server
 */

// Get the base path from environment or use default
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'

// Get the server port - in development it might be different from the default 3000
export const getServerPort = (): string => {
  // In client-side code, we can access the current URL
  if (typeof window !== 'undefined') {
    return window.location.port || '3000'
  }
  
  // In server-side code, default to 3000 or environment variable
  return process.env.PORT || '3000'
}

// Get the full base URL including protocol, host, port and basePath
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }
  
  // Server-side fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

// Get the full API URL
export const getApiUrl = (path: string): string => {
  return `${getBaseUrl()}${basePath}${path}`
}
