'use server'

import { getPayload, Where } from 'payload'
import configPromise from '@payload-config'
import type {
  TemplateData,
  PaginatedTemplatesResponse,
  FetchTemplatesOptions,
} from '@/app/(frontend)/_types/template-data'
import { TemplateStatus } from '@/app/(frontend)/_types/template'

export async function fetchTemplates(
  options: FetchTemplatesOptions = {},
): Promise<PaginatedTemplatesResponse> {
  const payload = await getPayload({
    config: configPromise,
  })

  const { page = 1, limit = 10, filter = {} } = options

  const response = await payload.find({
    collection: 'pages',
    where: filter as Where,
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

export async function updateTemplateStatus(
  id: string,
  status: TemplateStatus,
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
