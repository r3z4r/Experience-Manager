import { NextResponse } from 'next/server'
import { updateTemplate } from '@/app/(frontend)/_actions/templates'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await updateTemplate(params.id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error('Failed to publish template:', error)
    return NextResponse.json(
      { error: 'Failed to publish template' },
      { status: 500 }
    )
  }
}
