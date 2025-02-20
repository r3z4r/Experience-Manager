'use server'

import type { ReactElement } from 'react'
import type { BlockProperties, ComponentDefinition } from 'grapesjs'

export async function createBlockConfig({
  id,
  label,
  category,
  component,
  attributes,
}: {
  id: string
  label: string
  category: string
  component: ReactElement
  attributes: Record<string, string>
}): Promise<BlockProperties> {
  return {
    id,
    label,
    category,
    content: component as unknown as ComponentDefinition,
    attributes,
  }
}
