'use client'

import type { ReactElement } from 'react'
import type { BlockProperties } from 'grapesjs'
import { renderToStaticMarkup } from 'react-dom/server'

export function processBlockContent(block: BlockProperties): BlockProperties {
  const content = block.content
  return {
    ...block,
    content:
      typeof content === 'string'
        ? content
        : renderToStaticMarkup(content as unknown as ReactElement),
  }
}
