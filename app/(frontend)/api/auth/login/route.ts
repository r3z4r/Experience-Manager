import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const payload = await getPayload({
      config: configPromise,
    })

    await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set('user-email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
