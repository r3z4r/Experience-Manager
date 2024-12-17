'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import type { User } from '@/payload-types'

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const email = cookieStore.get('user-email')

  if (!email) {
    return null
  }

  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const {
      docs: [user],
    } = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.value,
        },
      },
    })

    return user as User
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
}
