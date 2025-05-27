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
  const resolvedParams = await params
  const user = await getCurrentUser()
  const template = await fetchTemplateBySlug(resolvedParams.slug)

  if (!template) {
    notFound()
  }

  try {
    const { html, css, scripts } = await renderTemplate(template, user)

    return (
      <div className="template-page">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {scripts && (
          // Use key={Date.now()} to ensure script re-execution when navigating between pages
          <script 
            key={Date.now()}
            dangerouslySetInnerHTML={{ 
              __html: `
                // Execute scripts in a safe, isolated context
                (function() {
                  try {
                    ${scripts}
                  } catch (error) {
                    console.error('Error executing template scripts:', error);
                  }
                })();
              ` 
            }} 
          />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error rendering template:', error)
    throw error // Let Next.js error handling take care of this
  }
}
