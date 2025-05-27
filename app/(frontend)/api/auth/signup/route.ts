import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()

    const payload = await getPayload({
      config: configPromise,
    })

    // Create the user in the users collection
    await payload.create({
      collection: 'users',
      data: {
        email,
        username,
        password,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to sign up' },
      { status: 400 }
    )
  }
}
