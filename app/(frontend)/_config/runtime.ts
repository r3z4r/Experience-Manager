/**
 * Runtime configuration for the Experience Manager
 * This file provides runtime configuration values that can be accessed on both client and server
 */

import { headers } from 'next/headers'

// Get the base path from environment or use default
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'

// Get the server port - in development it might be different from the default 3000
// This function is kept for potential other uses; getBaseUrl below now handles port dynamically for server-side.
export const getServerPort = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.port || '3000'
  }
  return process.env.PORT || '3000'
}

// Get the full base URL including protocol, host, and port
export const getBaseUrl = async (): Promise<string> => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }

  const heads = await headers()
  const protocol = heads.get('x-forwarded-proto') || 'http'
  const host = heads.get('x-forwarded-host') || heads.get('host')

  if (!host) {
    console.warn(
      '[runtime.ts] Could not determine host from headers for getBaseUrl, defaulting to http://localhost:3000',
    )
    return 'http://localhost:3000'
  }

  return `${protocol}://${host}`
}

// Get the full API URL
export const getApiUrl = async (path: string): Promise<string> => {
  const url = await getBaseUrl()
  return `${url}${basePath}${path}`
}
