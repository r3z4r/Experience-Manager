import { fetchTemplateById } from '@/app/(frontend)/_actions/templates'
import type { TemplateData } from '@/app/(frontend)/_actions/templates'
import Link from 'next/link'

async function getTemplate(id: string): Promise<TemplateData> {
  try {
    const template = await fetchTemplateById(id)
    if (!template) {
      throw new Error('Template not found')
    }
    return template
  } catch (error) {
    console.error('Error fetching template:', error)
    throw new Error('Failed to load template')
  }
}

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const template = await getTemplate(params.id)

  return (
    <div className="p-4">
      <Link
        href="/template-list"
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1001 }}
        className="text-blue-500 hover:underline"
      >
        &larr; Back to Template List
      </Link>
      <style dangerouslySetInnerHTML={{ __html: template.cssContent ?? '' }} />
      <div dangerouslySetInnerHTML={{ __html: template.htmlContent ?? '' }} />
    </div>
  )
}
