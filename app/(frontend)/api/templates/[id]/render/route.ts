import { NextResponse } from 'next/server'
import { fetchTemplateById } from '@/app/(frontend)/_actions/templates'
import { getCurrentUser } from '@/app/(frontend)/_actions/auth'
import { renderTemplate } from '@/utils/template-renderer'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const template = await fetchTemplateById(resolvedParams.id)
    const user = await getCurrentUser()

    const rendered = await renderTemplate(template, user)
    return NextResponse.json(rendered)
  } catch (error) {
    if (error instanceof Error && error.message === 'Access denied') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    console.error('Error rendering template:', error)
    return NextResponse.json({ error: 'Failed to render template' }, { status: 500 })
  }
}
