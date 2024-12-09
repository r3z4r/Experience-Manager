import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface PayloadImage {
  id: string
  title: string
  category: 'hero' | 'doctors' | 'services' | 'logos'
  alt: string
  width: number
  height: number
  url: string
  filename: string
  mimeType: string
  filesize: number
  createdAt: string
  updatedAt: string
}

export interface ImagesResponse {
  docs: PayloadImage[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export const fetchImages = async (): Promise<PayloadImage[]> => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const response = await payload.find({
      collection: 'images',
      limit: 20,
    })
    return response.docs as PayloadImage[]
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
