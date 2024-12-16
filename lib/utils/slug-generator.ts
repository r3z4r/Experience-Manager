'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function generateSlug(title: string): Promise<string> {
  const payload = await getPayload({
    config: configPromise,
  })

  // Basic slug generation
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // Check for existing slugs
  let counter = 0
  let finalSlug = slug
  let exists = true

  while (exists) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: finalSlug,
        },
      },
    })

    if (existing.docs.length === 0) {
      exists = false
    } else {
      counter++
      finalSlug = `${slug}-${counter}`
    }
  }

  return finalSlug
}
