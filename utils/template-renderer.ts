import { TemplateData } from '@/app/(frontend)/_actions/templates'
import { componentHandlers } from './component-handlers'
import { User } from 'payload'

export function hasAccess(template: TemplateData, user: User | null): boolean {
  // Published templates only
  if (template.status !== 'published') {
    return false
  }

  switch (template.access.visibility) {
    case 'public':
      return true
    case 'private':
      return user != null
    case 'restricted':
      return user != null && template.access.allowedUsers?.includes(user.id) === true
    default:
      return false
  }
}

export async function renderTemplate(template: TemplateData, user: User | null = null) {
  if (!hasAccess(template, user)) {
    throw new Error('Access denied')
  }

  let html = template.htmlContent
  const scripts: string[] = []

  if (template.components) {
    for (const component of template.components) {
      const handler = componentHandlers[component.type]
      if (handler) {
        const { html: componentHtml, script } = await handler.render(component.config)

        // Replace component placeholder with actual component
        html = html?.replace(
          new RegExp(`<div data-component="${component.placement}"></div>`),
          componentHtml,
        )

        if (script) {
          scripts.push(script)
        }
      }
    }
  }

  return {
    html,
    css: template.cssContent,
    scripts: scripts.join('\n'),
  }
}
