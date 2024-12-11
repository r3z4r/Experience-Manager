import { NextResponse } from 'next/server'
import { fetchTemplates, createTemplate } from '@/app/(frontend)/_actions/templates'

export async function GET() {
  try {
    const templates = await fetchTemplates()
    return NextResponse.json(templates)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const template = await createTemplate({
      title: body.name || 'New Template',
      description: body.description,
      htmlContent: body.html || '',
      cssContent: body.css || '',
      gjsData: body.gjsData,
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}
