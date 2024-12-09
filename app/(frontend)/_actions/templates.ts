'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Where } from 'payload'
import { ProjectData } from 'grapesjs'

export interface TemplateData {
  id?: string
  title: string
  description?: string | null
  htmlContent?: string | null
  cssContent?: string
  gjsData?: ProjectData
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
  filter?: Where
}

export async function fetchTemplates(
  options: FetchTemplatesOptions = {},
): Promise<PaginatedTemplatesResponse> {
  const payload = await getPayload({
    config: configPromise,
  })

  const { page = 1, limit = 10, filter = {} } = options

  const response = await payload.find({
    collection: 'pages',
    where: filter,
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

export async function createTemplate(templateData: TemplateData) {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.create({
    collection: 'pages',
    data: templateData,
  })
}

export async function updateTemplate(id: string, templateData: TemplateData) {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload.update({
    collection: 'pages',
    id,
    data: templateData,
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
