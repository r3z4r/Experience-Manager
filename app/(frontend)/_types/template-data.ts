import type { Page } from '@/payload-types'

export type ComponentConfig = {
  [key: string]: string | number | boolean | null | undefined | ComponentConfig | ComponentConfig[]
}

export interface PaginatedTemplatesResponse {
  docs: Page[]
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

export interface FetchTemplatesOptions {
  page?: number
  limit?: number
  filter?: Record<string, unknown>
  search?: string
  sortBy?: 'created' | 'name'
  sortOrder?: 'asc' | 'desc'
  tab?: 'all' | 'recent' | 'draft' | 'published' | 'archived'
  username?: string // Add support for filtering by username
  enforceUserFiltering?: boolean // Whether to enforce user-based access control filtering
}
