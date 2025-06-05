'use server'

import { getCurrentUser } from '@/app/(frontend)/_actions/auth';

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import type {
  PaginatedTemplatesResponse,
  FetchTemplatesOptions,
} from '@/app/(frontend)/_types/template-data'
import { TemplateStatus } from '@/app/(frontend)/_types/template'
import type { Page, User } from '@/payload-types'

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
    username = undefined,
    enforceUserFiltering = true,
  } = options

  const conditions: PayloadWhere[] = buildQueryConditions(filter, search)

  if (username) {
    const users = await payload.find({
      collection: 'users',
      where: {
        username: { equals: username },
      },
      limit: 1,
    })

    if (users.docs.length > 0) {
      const userId = users.docs[0].id
      conditions.push({ user: { equals: userId } })
    }
  }

  const currentUser = await getCurrentUser()

  if (enforceUserFiltering && currentUser && !currentUser.roles?.includes('admin')) {
    // Apply the same access control rules as in the Pages collection:
    // Users can only see pages they created, public pages, or pages they have explicit access to
    conditions.push({
      or: [
        { user: { equals: currentUser.id } },
        { 'access.visibility': { equals: 'public' } },
        { 'access.allowedUsers': { contains: currentUser.id } },
      ],
    })
  }

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

  // Add user filter if provided
  if (filter.userId) {
    conditions.push({ user: { equals: filter.userId } })
  }

  // Add search condition if provided
  const trimmedSearch = search.trim()
  if (trimmedSearch.length > 0) {
    conditions.push({
      or: [{ title: { like: trimmedSearch } }, { description: { like: trimmedSearch } }],
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
  tab?: string,
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

  // Get the current user
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error('User must be authenticated to create a template')
  }

  // Create template
  const template = await payload.create({
    collection: 'pages',
    data: {
      ...templateData,
      slug: templateData.slug || 'temp-slug',
      user: currentUser.id, // Include the user ID for ownership
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

export async function fetchTemplateBySlug(slug: string, username?: string) {
  const payload = await getPayload({
    config: configPromise,
  })

  try {
    // Build the query conditions
    const whereConditions: PayloadWhere = {
      slug: { equals: slug },
    }

    // If username is provided, add a filter for templates created by that user
    if (username) {
      // First get the user ID from the username
      const users = await payload.find({
        collection: 'users',
        where: {
          username: { equals: username },
        },
        limit: 1,
      })

      if (users.docs.length > 0) {
        const userId = users.docs[0].id
        whereConditions.user = { equals: userId }
      }
    }

    const templates = await payload.find({
      collection: 'pages',
      where: whereConditions,
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
    // First, get the original template to access its data
    const originalTemplate = (await payload.findByID({
      collection: 'pages',
      id: templateId,
    })) as Page

    // Create new template with the original template's data
    // The duplicate method automatically maintains the user field
    // which ensures proper ownership is preserved
    const duplicatedTemplate = await payload.duplicate({
      collection: 'pages',
      id: templateId,
    })

    // Update the duplicated template with the new data
    // Only update specific fields, leaving the user field untouched
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


/**
 * Fetch templates created by the currently authenticated user
 * @param options - Options for fetching templates
 * @returns Paginated templates response with only the user's templates
 */
export async function fetchCurrentUserTemplates(
  options: FetchTemplatesOptions = {},
): Promise<PaginatedTemplatesResponse> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    // Return empty response if no user is authenticated
    return {
      docs: [],
      totalDocs: 0,
      limit: options.limit || 10,
      totalPages: 0,
      page: options.page || 1,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    } as PaginatedTemplatesResponse
  }

  // Add the current user's ID to the filter
  return fetchTemplates({
    ...options,
    filter: {
      ...options.filter,
      userId: currentUser.id,
    },
  })
}

/**
 * Update the access permissions for a template
 * @param id - The template ID
 * @param visibility - The visibility setting (public, private, restricted)
 * @param allowedUsers - Array of user IDs who can access the template (for restricted visibility)
 * @returns The updated template
 */
export async function updateTemplateAccess(
  id: string,
  visibility: 'public' | 'private' | 'restricted',
  allowedUsers?: string[],
): Promise<Page> {
  const payload = await getPayload({
    config: configPromise,
  })

  try {
    // Prepare the access data
    const accessData: {
      visibility: 'public' | 'private' | 'restricted'
      allowedUsers?: string[]
    } = {
      visibility,
    }

    // Only include allowedUsers if visibility is restricted
    if (visibility === 'restricted' && allowedUsers && allowedUsers.length > 0) {
      accessData.allowedUsers = allowedUsers
    }

    // Update the template
    const updatedTemplate = await payload.update({
      collection: 'pages',
      id,
      data: {
        access: accessData,
      },
    })

    return updatedTemplate as Page
  } catch (error) {
    console.error('Error updating template access:', error)
    throw error
  }
}

/**
 * Add a user to the allowed users list for a template
 * @param templateId - The template ID
 * @param userId - The user ID to add
 * @returns The updated template
 */
export async function addUserToTemplate(templateId: string, userId: string): Promise<Page> {
  const payload = await getPayload({
    config: configPromise,
  })

  try {
    // First get the current template to check its access settings
    const template = (await payload.findByID({
      collection: 'pages',
      id: templateId,
    })) as Page

    // Get the current allowed users or initialize empty array
    const currentAllowedUsers = template.access?.allowedUsers || []

    // Convert to string array to ensure type safety
    const currentAllowedUserIds = currentAllowedUsers.map((id) =>
      typeof id === 'string' ? id : id.toString(),
    )

    // Only add the user if they're not already in the list
    if (!currentAllowedUserIds.includes(userId)) {
      // Update the template with the new allowed users list
      return updateTemplateAccess(templateId, 'restricted', [...currentAllowedUserIds, userId])
    }

    // User is already in the list, return the template as is
    return template
  } catch (error) {
    console.error('Error adding user to template:', error)
    throw error
  }
}

/**
 * Remove a user from the allowed users list for a template
 * @param templateId - The template ID
 * @param userId - The user ID to remove
 * @returns The updated template
 */
export async function removeUserFromTemplate(templateId: string, userId: string): Promise<Page> {
  const payload = await getPayload({
    config: configPromise,
  })

  try {
    // First get the current template to check its access settings
    const template = (await payload.findByID({
      collection: 'pages',
      id: templateId,
    })) as Page

    // Get the current allowed users or initialize empty array
    const currentAllowedUsers = template.access?.allowedUsers || []

    // Convert to string array and filter out the user to remove
    const updatedAllowedUsers = currentAllowedUsers
      .map((id) => (typeof id === 'string' ? id : id.toString()))
      .filter((id) => id !== userId)

    // Update the template with the new allowed users list
    // If no users are left and visibility was restricted, change to private
    const newVisibility =
      template.access?.visibility === 'restricted' && updatedAllowedUsers.length === 0
        ? 'private'
        : template.access?.visibility || 'public'

    return updateTemplateAccess(
      templateId,
      newVisibility as 'public' | 'private' | 'restricted',
      updatedAllowedUsers,
    )
  } catch (error) {
    console.error('Error removing user from template:', error)
    throw error
  }
}
