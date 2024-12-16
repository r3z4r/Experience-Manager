'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import type { User } from '@/payload-types'

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  if (!token) {
    return null
  }

  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const user = await payload.findByID({
      collection: 'users',
      id: token.value,
    })

    return user as User
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
}
