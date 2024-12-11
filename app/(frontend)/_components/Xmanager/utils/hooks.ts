import { useEffect, useState } from 'react'
import { Editor as GrapesEditor } from 'grapesjs'
import { fetchTemplateById } from '@/app/(frontend)/_actions/templates'
import { toast } from 'sonner'

export const useTemplateData = (templateId: string | undefined) => {
  const [initialData, setInitialData] = useState<{
    html: string
    css: string
    gjsData?: unknown
  } | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!templateId) return

      try {
        const template = await fetchTemplateById(templateId)
        if (!template) {
          toast.error('Template not found')
          return
        }

        setInitialData({
          gjsData: template.gjsData,
          html: template.htmlContent || '',
          css: template.cssContent || '',
        })

        setTemplateName(template.title || '')
        setTemplateDescription(template.description || '')
      } catch (error) {
        console.error('Error loading template:', error)
        toast.error('Failed to load template')
      }
    }

    fetchInitialData()
  }, [templateId])

  return {
    initialData,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
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
