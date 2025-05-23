'use server'

import { revalidatePath } from 'next/cache'
import { getPayload, WhereField } from 'payload'
import configPromise from '@payload-config'
import type {
  PaginatedTemplatesResponse,
  FetchTemplatesOptions,
} from '@/app/(frontend)/_types/template-data'
import { TemplateStatus } from '@/app/(frontend)/_types/template'
import type { Page } from '@/payload-types'

export async function fetchTemplates(
  options: FetchTemplatesOptions = {},
): Promise<PaginatedTemplatesResponse> {
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
}

export async function fetchTemplateById(id: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.findByID({
    collection: 'pages',
    id,
  })
}

export async function createTemplate(templateData: {
  title: string
  description?: string
  htmlContent?: string
  cssContent?: string
  jsContent?: string
  gjsData?: any
  status: 'draft' | 'published' | 'archived'
  access: {
    visibility: 'public' | 'private' | 'restricted'
    allowedUsers?: string[]
  }
  slug?: string
}) {
  const payload = await getPayload({
    config: configPromise,
  })

  // Create template
  const template = await payload.create({
    collection: 'pages',
    data: {
      ...templateData,
      // Set a temporary slug that will be updated after creation
      slug: templateData.slug || 'temp-slug',
    },
  })

  return template
}

export async function updateTemplate(id: string, data: Partial<Page>) {
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

export async function updateTemplateStatus(id: string, status: TemplateStatus): Promise<Page> {
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
    return template as Page
  } catch (error) {
    console.error('Error updating template status:', error)
    throw error
  }
}

export async function fetchTemplateBySlug(slug: string) {
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
}

export async function duplicateTemplate(
  templateId: string,
  newName: string,
  newDescription: string,
  newSlug: string,
): Promise<Page> {
  const payload = await getPayload({
    config: configPromise,
  })
  try {
    // Create new template with the original template's data
    const duplicatedTemplate = await payload.duplicate({
      collection: 'pages',
      id: templateId,
    })
    // Update the duplicated template with the new data
    await payload.update({
      collection: 'pages',
      id: duplicatedTemplate.id,
      data: {
        title: newName,
        description: newDescription,
        slug: newSlug,
        status: 'draft',
      },
    })
    revalidatePath('/xmanager')
    return duplicatedTemplate as Page
  } catch (error) {
    console.error('Error duplicating template:', error)
    throw error
  }
}
