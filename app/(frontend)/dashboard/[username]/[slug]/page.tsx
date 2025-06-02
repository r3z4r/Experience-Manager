import { fetchTemplateBySlug } from '@/app/(frontend)/_actions/templates'
import { renderTemplate } from '@/lib/utils/template-renderer'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/app/(frontend)/_actions/auth'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { User } from '@/payload-types'

interface PageProps {
  params: {
    username: string
    slug: string
  }
}

export default async function UserTemplatePage({ params }: PageProps) {
  const { username, slug } = params
  const currentUser = await getCurrentUser()
  
  // Initialize PayloadCMS
  const payload = await getPayload({
    config: configPromise,
  })
  
  // Find the user by username
  const usersResult = await payload.find({
    collection: 'users',
    where: {
      username: {
        equals: username,
      },
    },
    limit: 1,
  })
  
  // If user doesn't exist, show 404
  if (!usersResult.docs || usersResult.docs.length === 0) {
    notFound()
  }
  
  const pageOwner = usersResult.docs[0] as User
  
  // Fetch the template by slug
  const template = await fetchTemplateBySlug(slug)
  
  if (!template) {
    notFound()
  }
  
  // Check if current user has access to this template
  // Admin can view all templates, users can only view their own
  const isAdmin = currentUser?.roles?.includes('admin')
  const isOwner = currentUser?.id === pageOwner.id
  
  if (!isAdmin && !isOwner) {
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
