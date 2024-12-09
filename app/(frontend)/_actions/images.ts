'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Image } from '@/payload-types'

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

    console.log('response', response)

    const images = (response?.docs || []).map((doc: Image) => ({
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
        thumbnail: doc.sizes?.thumbnail || null,
        card: doc.sizes?.card || null,
      },
    }))

    return images
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

export async function uploadImage(file: File, category?: string): Promise<PayloadImage> {
  const formData = new FormData()
  formData.append('file', file)
  if (category) {
    formData.append('category', category)
  }

  const response = await fetch('/api/upload-images', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  return response.json()
}

export async function createImage(file: File, category?: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.create({
    collection: 'images',
    data: {
      title: file.name,
      alt: file.name,
      category: category || 'hero',
      status: 'published',
    },
    file: file as unknown as PayloadFile, // Type assertion for Payload's file type
  })
}
