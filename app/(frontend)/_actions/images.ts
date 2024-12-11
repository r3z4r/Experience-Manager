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

  console.log('Uploading file:', {
    name: file.name,
    size: file.size,
    type: file.type,
    category,
  })

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/xpm/api/upload-images`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Upload failed:', data)
    throw new Error(data.details || 'Failed to upload image')
  }

  return data
}

export async function createImage(file: File, category?: string) {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const buffer = Buffer.from(await file.arrayBuffer())

    const image = await payload.create<Image>({
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

    return image
  } catch (error) {
    console.error('Error in createImage:', error)
    throw error
  }
}
