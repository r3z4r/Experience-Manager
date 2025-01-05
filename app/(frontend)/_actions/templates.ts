'use server'

import { cache } from 'react'
import { getPayload, WhereField } from 'payload'
import configPromise from '@payload-config'
import type {
  TemplateData,
  PaginatedTemplatesResponse,
  FetchTemplatesOptions,
} from '@/app/(frontend)/_types/template-data'
import { Page } from '@/payload-types'

export const fetchTemplates = cache(
  async (options: FetchTemplatesOptions = {}): Promise<PaginatedTemplatesResponse> => {
    const payload = await getPayload({
      config: configPromise,
    })

    const { page = 1, limit = 10, filter = {} } = options

    // Construct the where clause
    const where: { [key: string]: WhereField } = {}

    // Add status filter if provided
    if (filter.status) {
      where.status = { equals: filter.status }
    }

    // Add visibility filter if provided
    if (filter.visibility) {
      where['access.visibility'] = { equals: filter.visibility }
    }

    const response = await payload.find({
      collection: 'pages',
      where,
      limit,
      page,
    })

    return response as PaginatedTemplatesResponse
  },
)

export const fetchTemplateById = cache(async (id: string): Promise<Page | null> => {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.findByID({
    collection: 'pages',
    id,
  })
})

export async function createTemplate(templateData: TemplateData) {
  const payload = await getPayload({
    config: configPromise,
  })

  // Create template
  const template = await payload.create({
    collection: 'pages',
    data: {
      ...templateData,
      // Set a temporary slug that will be updated after creation
      slug: 'temp-slug',
    },
  })

  return template
}

export async function updateTemplate(id: string, data: Partial<TemplateData>) {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.update({
    collection: 'pages',
    id,
    data,
  })
}

export async function deleteTemplate(id: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.delete({
    collection: 'pages',
    id,
  })
}

export async function updateTemplateStatus(
  id: string,
  status: Page['status'],
): Promise<TemplateData> {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const template = await payload.update({
      collection: 'pages',
      id,
      data: {
        status,
      },
    })
    return template as TemplateData
  } catch (error) {
    console.error('Error updating template status:', error)
    throw error
  }
}

export const fetchTemplateBySlug = cache(async (slug: string) => {
  const payload = await getPayload({
    config: configPromise,
  })

  try {
    const templates = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })

    return templates.docs[0] || null
  } catch (error) {
    console.error('Error fetching template by slug:', error)
    return null
  }
})
