'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type {
  PaginatedTemplatesResponse,
  FetchTemplatesOptions,
} from '@/app/(frontend)/_types/template-data'
import { TemplateStatus } from '@/app/(frontend)/_types/template'
import type { Page } from '@/payload-types'

// Define proper types for PayloadCMS queries
type WhereCondition = {
  equals?: string | boolean | number
  not_equals?: string | boolean | number
  greater_than?: number
  greater_than_equal?: number
  less_than?: number
  less_than_equal?: number
  like?: string
  contains?: string
  in?: (string | number)[]
  not_in?: (string | number)[]
  all?: (string | number)[]
  exists?: boolean
}

interface WhereField {
  [key: string]: any
}

type PayloadWhere = {
  [key: string]: any
}

/**
 * Fetches templates from the Pages collection with filtering, sorting, and pagination
 * @param options - Options for fetching templates
 * @returns Paginated templates response
 */
export async function fetchTemplates(
  options: FetchTemplatesOptions = {},
): Promise<PaginatedTemplatesResponse> {
  const payload = await getPayload({
    config: configPromise,
  })

  const {
    page = 1,
    limit = 10,
    filter = {},
    search = '',
    sortBy = 'created',
    sortOrder = 'desc',
    tab = undefined,
  } = options

  // Build query conditions
  const conditions: PayloadWhere[] = buildQueryConditions(filter, search)
  
  // Determine sort order
  const sort = determineSortOrder(sortBy, sortOrder, tab)

  // Construct the where clause based on conditions
  const where = buildWhereClause(conditions)

  // Execute the query
  const response = await payload.find({
    collection: 'pages',
    where,
    limit,
    page,
    sort,
  })

  return response as PaginatedTemplatesResponse
}

/**
 * Builds query conditions based on filters and search term
 */
function buildQueryConditions(filter: Record<string, any>, search: string): PayloadWhere[] {
  const conditions: PayloadWhere[] = []

  // Add status filter if provided
  if (filter.status) {
    conditions.push({ status: { equals: filter.status } })
  }

  // Add visibility filter if provided
  if (filter.visibility) {
    conditions.push({ 'access.visibility': { equals: filter.visibility } })
  }

  // Add search condition if provided
  const trimmedSearch = search.trim()
  if (trimmedSearch.length > 0) {
    conditions.push({
      or: [
        { title: { like: trimmedSearch } }, 
        { description: { like: trimmedSearch } }
      ],
    })
  }

  return conditions
}

/**
 * Determines the sort order based on sortBy, sortOrder, and tab
 */
function determineSortOrder(
  sortBy: string, 
  sortOrder: 'asc' | 'desc', 
  tab?: string
): string | undefined {
  // Tab-based sorting override
  if (tab === 'recent') {
    return '-createdAt'
  }
  
  // Standard sorting
  if (sortBy === 'name') {
    return sortOrder === 'desc' ? '-title' : 'title'
  } 
  
  if (sortBy === 'created') {
    return sortOrder === 'desc' ? '-createdAt' : 'createdAt'
  }
  
  return undefined
}

/**
 * Builds the where clause from conditions
 */
function buildWhereClause(conditions: PayloadWhere[]): PayloadWhere {
  if (conditions.length === 0) {
    return {}
  }
  
  if (conditions.length === 1) {
    return conditions[0]
  }
  
  return {
    and: conditions,
  }
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
