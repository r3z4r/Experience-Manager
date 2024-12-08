import type { ProjectData } from 'grapesjs'
import { Page } from '../payload-types'

interface EditableRegion {
  id: string
  label: string
  selector: string
  content: string
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

  components.forEach((component: any) => {
    if (component.attributes?.['data-gjs-editable-id'] === region.id) {
      component.content = region.content
    }
    if (component.components) {
      updateComponentContent(component.components, region)
    }
  })
}
