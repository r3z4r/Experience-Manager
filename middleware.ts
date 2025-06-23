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
  const { pathname } = request.nextUrl

  // --- 1. Handle CORS for API routes ---
  if (pathname.startsWith('/api')) {
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

  // --- 2. Auth protection for frontend and admin routes ---
  // Check for the payload-token cookie set by PayloadCMS upon successful login
  const token = request.cookies.get('payload-token')?.value

  // Skip auth check for login page and public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    // Preserve the original pathname (without basePath) in 'next' query param
    const originalPathname = pathname.startsWith(request.nextUrl.basePath)
      ? pathname.substring(request.nextUrl.basePath.length)
      : pathname
    loginUrl.searchParams.set('next', originalPathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/admin/:path*'],
}
