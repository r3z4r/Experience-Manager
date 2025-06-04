import { fetchTemplateBySlug } from '@/app/(frontend)/_actions/templates'
import { renderTemplate } from '@/lib/utils/template-renderer'
import { notFound } from 'next/navigation'
import { getCurrentUser, findUserByUsername } from '@/app/(frontend)/_actions/auth'
import { ACCESS_VISIBILITY } from '@/app/(frontend)/_types/template'

interface PageProps {
  params: Promise<{
    username: string
    slug: string
  }>
}

export default async function UserTemplatePage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise
  const { username, slug } = params
  const currentUser = await getCurrentUser()
  const pageOwner = await findUserByUsername(username)

  // If user doesn't exist, show 404
  if (!pageOwner) {
    notFound()
  }

  // Fetch the template by slug
  const template = await fetchTemplateBySlug(slug)

  if (!template) {
    notFound()
  }

  // Check if current user has access to this template
  // Admin can view all templates, users can only view their own
  const isAdmin = currentUser?.roles?.includes('admin')
  const isOwner = currentUser?.id === pageOwner.id

  if (!isAdmin && !isOwner && template.access.visibility !== ACCESS_VISIBILITY.PUBLIC) {
    // User doesn't have permission to view this template
    notFound()
  }

  try {
    const { html, css, scripts } = await renderTemplate(template, currentUser)

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
              `,
            }}
          />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error rendering template:', error)
    throw error
  }
}
