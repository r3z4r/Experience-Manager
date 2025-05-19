'use client'

import type { ReactElement } from 'react'
import type { BlockProperties } from 'grapesjs'
import { renderToStaticMarkup } from 'react-dom/server'

export function processBlockContent(block: BlockProperties): any {
  const content = block.content
  if (content && typeof content === 'object' && !('type' in content && content.type === 'script')) {
    return {
      ...block,
      content:
        typeof content === 'string'
          ? content
          : renderToStaticMarkup(content as unknown as ReactElement),
    }
  }
}
