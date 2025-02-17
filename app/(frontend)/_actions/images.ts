'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Image } from '@/payload-types'
import { revalidatePath } from 'next/cache'

export interface PayloadImage {
  id: string
  title: string
  category: string
  alt: string
  width: number
  height: number
  url: string
  filename: string
  mimeType: string
  filesize: number
  createdAt: string
  updatedAt: string
  sizes: {
    thumbnail: { url: string; width: number; height: number } | null
    card: { url: string; width: number; height: number } | null
  }
}

export const fetchImages = async (): Promise<PayloadImage[]> => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const response = await payload.find({
      collection: 'images',
      limit: 100,
      depth: 0,
      where: {
        status: { equals: 'published' },
      },
    })

    return (response?.docs || []).map((doc: Image) => ({
      id: doc.id,
      title: doc.title || '',
      category: doc.category,
      alt: doc.alt || '',
      width: doc.width || 0,
      height: doc.height || 0,
      url: doc.url || '',
      filename: doc.filename || '',
      mimeType: doc.mimeType || '',
      filesize: doc.filesize || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      sizes: {
        thumbnail: doc.sizes?.thumbnail
          ? {
              url: doc.sizes.thumbnail.url || '',
              width: doc.sizes.thumbnail.width || 0,
              height: doc.sizes.thumbnail.height || 0,
            }
          : null,
        card: doc.sizes?.card
          ? {
              url: doc.sizes.card.url || '',
              width: doc.sizes.card.width || 0,
              height: doc.sizes.card.height || 0,
            }
          : null,
      },
    }))
  } catch (error) {
    console.error('Error fetching images:', error)
    return []
  }
}

export const fetchImagesByCategory = async (category: string): Promise<PayloadImage[]> => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const response = await payload.find({
      collection: 'images',
      where: {
        category: {
          equals: category,
        },
      },
      limit: 100,
    })
    return response.docs as PayloadImage[]
  } catch (error) {
    console.error('Error fetching images by category:', error)
    return []
  }
}

export async function createImage(file: File, category?: string): Promise<PayloadImage> {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const buffer = Buffer.from(await file.arrayBuffer())

    const response = await payload.create({
      collection: 'images',
      data: {
        title: file.name,
        alt: file.name,
        category: (category || 'hero') as 'hero' | 'doctors' | 'services' | 'logos',
        status: 'published' as const,
        width: 0,
        height: 0,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    revalidatePath('/admin/images')

    return {
      id: response.id,
      title: response.title || '',
      category: response.category || '',
      alt: response.alt || '',
      width: response.width || 0,
      height: response.height || 0,
      url: response.url || '',
      filename: response.filename || '',
      mimeType: response.mimeType || '',
      filesize: response.filesize || 0,
      createdAt: response.createdAt || '',
      updatedAt: response.updatedAt || '',
      sizes: {
        thumbnail: response.sizes?.thumbnail
          ? {
              url: response.sizes.thumbnail.url || '',
              width: response.sizes.thumbnail.width || 0,
              height: response.sizes.thumbnail.height || 0,
            }
          : null,
        card: response.sizes?.card
          ? {
              url: response.sizes.card.url || '',
              width: response.sizes.card.width || 0,
              height: response.sizes.card.height || 0,
            }
          : null,
      },
    }
  } catch (error) {
    console.error('Error in createImage:', error)
    throw error
  }
}
