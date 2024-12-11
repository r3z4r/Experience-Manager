import { NextResponse } from 'next/server'
import {
  fetchTemplateById,
  updateTemplate,
  deleteTemplate,
} from '@/app/(frontend)/_actions/templates'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const template = await fetchTemplateById(resolvedParams.id)
    return NextResponse.json(template)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const resolvedParams = await params
    const template = await updateTemplate(resolvedParams.id, {
      title: body.name,
      description: body.description,
      htmlContent: body.html,
      cssContent: body.css,
      gjsData: body.gjsData,
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    await deleteTemplate(resolvedParams.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
