import type { ProjectData } from 'grapesjs'
import { Page } from '../payload-types'

type EditableRegionContent = {
  root: {
    type: string
    children: Array<{
      type: string
      version: number
      [key: string]: unknown
    }>
    direction: 'ltr' | 'rtl' | null
    format: '' | 'center' | 'left' | 'end' | 'right' | 'start' | 'justify'
    indent: number
    version: number
  }
  [key: string]: unknown
}

interface EditableRegion {
  id: string | null
  label: string
  selector: string
  content?: EditableRegionContent | null
}

interface GjsComponent {
  attributes?: {
    'data-gjs-editable-id'?: string | null
  }
  content?: EditableRegionContent | null
  components?: ProjectData['components']
}

export function syncEditableRegionsWithGjs(data: Partial<Page>): Partial<Page> {
  if (!data.gjsData || !data.editableRegions) {
    return data
  }

  const gjsData = data.gjsData as ProjectData
  const editableRegions = data.editableRegions as EditableRegion[]

  // Update GJS components with new content from editable regions
  if (gjsData.components) {
    editableRegions.forEach((region) => {
      updateComponentContent(gjsData.components, region)
    })
  }

  return {
    ...data,
    gjsData,
  }
}

function updateComponentContent(
  components: ProjectData['components'],
  region: EditableRegion,
): void {
  if (!components || !Array.isArray(components)) return

  components.forEach((component: GjsComponent) => {
    if (component.attributes?.['data-gjs-editable-id'] === region.id) {
      component.content = region.content
    }
    if (component.components) {
      updateComponentContent(component.components, region)
    }
  })
}
