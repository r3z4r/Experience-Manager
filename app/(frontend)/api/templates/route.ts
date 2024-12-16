import { NextResponse } from 'next/server'
import { fetchTemplates, createTemplate } from '@/app/(frontend)/_actions/templates'
import type { TemplateData } from '@/app/(frontend)/_types/template-data'

interface QueryParams {
  page?: string
  limit?: string
  status?: string
  visibility?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query parameters
    const params: QueryParams = {
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      visibility: searchParams.get('visibility') ?? undefined,
    }

    // Convert and validate pagination parameters
    const page = params.page ? parseInt(params.page, 10) : 1
    const limit = params.limit ? parseInt(params.limit, 10) : 10

    // Validate numeric values
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 })
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 })
    }

    // Construct filter object
    const filter: Record<string, unknown> = {}

    if (params.status) {
      filter.status = params.status
    }

    if (params.visibility) {
      filter['access.visibility'] = params.visibility
    }

    const templates = await fetchTemplates({
      page,
      limit,
      filter,
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const templateData: TemplateData = {
      title: body.name || 'New Template',
      description: body.description,
      htmlContent: body.html || '',
      cssContent: body.css || '',
      gjsData: body.gjsData,
      status: 'draft',
      access: {
        visibility: 'public',
      },
    }

    const template = await createTemplate(templateData)
    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}
