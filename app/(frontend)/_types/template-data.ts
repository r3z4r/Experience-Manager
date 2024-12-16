import type { ProjectData } from 'grapesjs'
import type { TemplateStatus, AccessVisibility, ComponentType } from './template'

export type ComponentConfig = {
  [key: string]: string | number | boolean | null | undefined | ComponentConfig | ComponentConfig[]
}

export interface TemplateData {
  id?: string
  title: string
  slug: string
  description?: string | null
  status: TemplateStatus
  htmlContent?: string | null
  cssContent?: string
  gjsData?: ProjectData
  access: {
    visibility: AccessVisibility
    allowedUsers?: string[]
  }
  components?: Array<{
    type: ComponentType
    config: ComponentConfig
    placement: string
  }>
  updatedAt?: string
  createdAt?: string
}

export interface PaginatedTemplatesResponse {
  docs: TemplateData[]
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
}
