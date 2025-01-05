import { useEffect, useState } from 'react'
import { Editor as GrapesEditor } from 'grapesjs'
import { fetchTemplateById, updateTemplate } from '@/app/(frontend)/_actions/templates'
import { toast } from 'sonner'
import { TEMPLATE_STATUS } from '@/app/(frontend)/_types/template'
import { Page } from '@/payload-types'

interface SlugState {
  value: string
  isEditing: boolean
  tempValue: string
}

interface TemplateState {
  initialData: {
    html: string
    css: string
    gjsData?: unknown
    status?: Page['status']
  } | null
  templateName: string
  templateDescription: string
  slug: SlugState
  status: Page['status']
}

export const useTemplateData = (templateId: string | undefined) => {
  const [state, setState] = useState<TemplateState>({
    initialData: null,
    templateName: '',
    templateDescription: '',
    slug: {
      value: '',
      isEditing: false,
      tempValue: '',
    },
    status: TEMPLATE_STATUS.DRAFT,
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!templateId) {
        setState((prev) => ({
          ...prev,
          slug: {
            ...prev.slug,
            value: templateId || '',
            tempValue: templateId || '',
          },
        }))
        return
      }

      try {
        const template = await fetchTemplateById(templateId)
        if (!template) {
          toast.error('Template not found')
          return
        }

        setState({
          initialData: {
            gjsData: template.gjsData,
            html: template.htmlContent || '',
            css: template.cssContent || '',
            status: template.status,
          },
          templateName: template.title || '',
          templateDescription: template.description || '',
          slug: {
            value: template.slug || template.id,
            isEditing: false,
            tempValue: template.slug || template.id,
          },
          status: template.status || TEMPLATE_STATUS.DRAFT,
        })
      } catch (error) {
        console.error('Error loading template:', error)
        toast.error('Failed to load template')
      }
    }

    fetchInitialData()
  }, [templateId])

  const setTemplateName = (name: string) => {
    setState((prev) => ({ ...prev, templateName: name }))
  }

  const setTemplateDescription = (description: string) => {
    setState((prev) => ({ ...prev, templateDescription: description }))
  }

  const handleSlugChange = (value: string) => {
    const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    setState((prev) => ({
      ...prev,
      slug: {
        ...prev.slug,
        tempValue: sanitizedValue,
      },
    }))
  }

  const syncSlug = (newValue: string) => {
    setState((prev) => ({
      ...prev,
      slug: {
        ...prev.slug,
        value: newValue,
      },
    }))
  }

  const startSlugEdit = () => {
    setState((prev) => ({
      ...prev,
      slug: {
        ...prev.slug,
        isEditing: true,
        tempValue: prev.slug.value,
      },
    }))
  }

  const cancelSlugEdit = () => {
    setState((prev) => ({
      ...prev,
      slug: {
        ...prev.slug,
        isEditing: false,
        tempValue: prev.slug.value,
      },
    }))
  }

  const saveSlug = async (newSlug?: string): Promise<boolean> => {
    try {
      const slugToSave = newSlug || state.slug.tempValue
      const sanitizedSlug = slugToSave.toLowerCase().replace(/[^a-z0-9-]/g, '-')

      if (!sanitizedSlug.trim()) {
        toast.error('Slug cannot be empty')
        return false
      }

      setState((prev) => ({
        ...prev,
        slug: {
          value: sanitizedSlug,
          isEditing: false,
          tempValue: sanitizedSlug,
        },
      }))

      if (templateId) {
        await updateTemplate(templateId, { slug: sanitizedSlug })
        toast.success('Slug updated successfully')
      }

      return true
    } catch (error) {
      console.error('Error updating slug:', error)
      toast.error('Failed to update slug')
      return false
    }
  }

  const setStatus = (status: Page['status']) => {
    setState((prev) => ({ ...prev, status }))
  }

  return {
    initialData: state.initialData,
    templateName: state.templateName,
    setTemplateName,
    templateDescription: state.templateDescription,
    setTemplateDescription,
    slug: {
      value: state.slug.value,
      isEditing: state.slug.isEditing,
      tempValue: state.slug.tempValue,
      handleSlugChange,
      startSlugEdit,
      cancelSlugEdit,
      saveSlug,
      syncSlug,
    },
    status: state.status,
    setStatus,
  }
}

export const useEditorSetup = (editor: GrapesEditor | null, mode: 'edit' | 'view') => {
  useEffect(() => {
    if (!editor) return

    if (mode === 'view') {
      editor.getModel().set('draftMode', false)
    }

    // Add custom commands
    editor.Commands.add('set-device-desktop', {
      run: (editor) => editor.setDevice('Desktop'),
    })
    editor.Commands.add('set-device-mobile', {
      run: (editor) => editor.setDevice('Mobile'),
    })
    editor.Commands.add('set-device-tablet', {
      run: (editor) => editor.setDevice('Tablet'),
    })

    // Add custom devices
    editor.Devices.add({
      name: 'Desktop',
      width: '',
    })
    editor.Devices.add({
      name: 'Tablet',
      width: '768px',
      widthMedia: '992px',
    })
    editor.Devices.add({
      name: 'Mobile',
      width: '320px',
      widthMedia: '480px',
    })

    // Add save button to options panel
    const optionsPanel = editor.Panels.getPanel('options')
    if (optionsPanel) {
      editor.Panels.addButton('options', {
        id: 'save-template',
        className: 'fa fa-floppy-o',
        command: 'store-data',
        attributes: { title: 'Save Template' },
      })
    }

    return () => {
      if (editor && !editor.destroy) {
        try {
          console.log('destroying editor')
          editor.destroy()
        } catch (error) {
          console.error('Error destroying editor:', error)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
