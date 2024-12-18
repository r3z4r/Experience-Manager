import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface CorsHeaders {
  'Access-Control-Allow-Credentials': string
  'Access-Control-Allow-Origin': string
  'Access-Control-Allow-Methods': string
  'Access-Control-Allow-Headers': string
  'Access-Control-Max-Age': string
  [key: string]: string
}

// Configure allowed origins, methods, and headers
const allowedOrigins: readonly string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000']

const corsHeaders: CorsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
  'Access-Control-Max-Age': '86400',
}

export function middleware(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.includes('/api')) {
    const origin = request.headers.get('origin') || ''
    const isAllowedOrigin = allowedOrigins.includes(origin) || allowedOrigins.includes('*')
    const finalOrigin = isAllowedOrigin ? origin : allowedOrigins[0]
    corsHeaders['Access-Control-Allow-Origin'] = finalOrigin

    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, { headers: corsHeaders })
    }

    const response = NextResponse.next()
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/(frontend)/api/:path*', '/api/:path*'],
}
