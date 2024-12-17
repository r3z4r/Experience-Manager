import { fetchTemplateBySlug } from '@/app/(frontend)/_actions/templates'
import { renderTemplate } from '@/lib/utils/template-renderer'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/app/(frontend)/_actions/auth'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TemplatePage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const user = await getCurrentUser()
    const template = await fetchTemplateBySlug(resolvedParams.slug)

    console.log('resolvedParams', resolvedParams)
    console.log('template', template)
    if (!template) {
      notFound()
    }

    const { html, css, scripts } = await renderTemplate(template, user)

    return (
      <div className="template-page">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {scripts && <script dangerouslySetInnerHTML={{ __html: scripts }} />}
      </div>
    )
  } catch (error) {
    console.error('Error rendering template:', error)
    notFound()
  }
}
