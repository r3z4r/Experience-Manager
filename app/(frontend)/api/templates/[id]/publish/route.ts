import { NextRequest, NextResponse } from 'next/server'
import { updateTemplate } from '@/app/(frontend)/_actions/templates'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const resolvedParams = await context.params
    const template = await updateTemplate(resolvedParams.id, {
      status: 'published',
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error('Failed to publish template:', error)
    return NextResponse.json({ error: 'Failed to publish template' }, { status: 500 })
  }
}
