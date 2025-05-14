'use client'

import type { ReactElement } from 'react'
import type { BlockProperties } from 'grapesjs'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * Process block content to ensure it's in the correct format for GrapesJS
 * Handles different types of content (string, React elements, or complex objects)
 */
export function processBlockContent(block: BlockProperties): BlockProperties {
  const content = block.content
  
  // If content is already a string, return it as is
  if (typeof content === 'string') {
    return block
  }
  
  // If content is a React element or can be rendered as HTML, convert it
  if (content && typeof content === 'object' && !('type' in content && content.type === 'script')) {
    try {
      // Only try to render if it looks like a React element
      if ('props' in content || '$$typeof' in content) {
        return {
          ...block,
          content: renderToStaticMarkup(content as unknown as ReactElement),
        }
      }
    } catch (error) {
      console.error('Error rendering block content:', error)
    }
  }
  
  // For script components or other complex objects, keep the original structure
  return block
}
