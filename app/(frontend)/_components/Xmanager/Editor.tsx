'use client'

import { useEffect, useRef, useState } from 'react'
import grapesjs, { Editor as GrapesEditor, ProjectData } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import './Editor.globals.css'
import styles from './Editor.module.css'
import { ArrowLeft, CloudUploadIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { customBlocks } from './blocks'
import { EditorProps } from './utils/types'
import { getEditorConfig } from './utils/editorConfig'
import { useTemplateData, useEditorSetup } from './utils/hooks'
import { ValidationError as PayloadValidationError } from 'payload'
import { ServerError, NetworkError } from './utils/types'
import { createTemplate, TemplateData, updateTemplate } from '../../_actions/templates'
import { fetchImages } from '@/app/(frontend)/_actions/images'
import type { PayloadImage } from '@/app/(frontend)/_actions/images'

type TemplateError = PayloadValidationError | ServerError | NetworkError

const Editor = ({ templateId, mode = 'edit' }: EditorProps) => {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<GrapesEditor | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [images, setImages] = useState<PayloadImage[]>([])

  const {
    initialData,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
  } = useTemplateData(templateId)

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchImages()
        setImages(fetchedImages ?? [])
      } catch (error) {
        console.error('Error loading images:', error)
      }
    }

    loadImages()
  }, [])

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return

    const editorInstance = grapesjs.init(
      getEditorConfig(
        editorRef.current,
        editor,
        templateName,
        templateDescription,
        templateId,
        setHasUnsavedChanges,
        (newTemplateId) => router.replace(`/editor/${newTemplateId}`),
        images,
      ),
    )

    editorInstance.setStyle(initialData?.css || '')
    editorInstance.setComponents(initialData?.html || '')

    if (initialData?.gjsData) {
      editorInstance.loadProjectData(initialData.gjsData as ProjectData)
    }

    // Add custom blocks
    customBlocks.forEach((block) => {
      editorInstance.BlockManager.add(block.id, block)
    })

    // Additional setup after editor is loaded
    editorInstance.on('load', () => {
      // Set up commands, panels, etc.
      editorInstance.Commands.add('save-template', {
        run: () => setShowSaveDialog(true),
      })
      // Additional editor customizations
      editorInstance.Panels.addButton('options', {
        id: 'save-db',
        className: 'fa fa-floppy-o ',
        command: 'save-template',
        attributes: { title: 'Save Template' },
      })
    })
    setEditor(editorInstance)

    return () => {
      console.log('destroying editor')
      editorInstance.destroy()
    }
  }, [editorRef.current, initialData])

  // Setup editor configurations and cleanup
  useEditorSetup(editor, mode)

  useEffect(() => {
    if (!editor) return

    const handleChange = () => {
      setHasUnsavedChanges(true)
    }

    editor.on('component:update', handleChange)
    editor.on('style:update', handleChange)
    editor.on('canvas:update', handleChange)

    return () => {
      editor.off('component:update', handleChange)
      editor.off('style:update', handleChange)
      editor.off('canvas:update', handleChange)
    }
  }, [editor])

  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = () => {
        return window.confirm('You have unsaved changes. Are you sure you want to leave?')
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  const handleSaveTemplate = async (): Promise<void> => {
    if (!editor) {
      throw new Error('Editor is not initialized')
    }

    // Validation checks
    const validationError = validateTemplateData()
    if (validationError) {
      setSaveStatus('error')
      toast.error(validationError.message)
      return
    }

    setSaveStatus('saving')

    try {
      const pageData: TemplateData = {
        title: templateName.trim(),
        description: templateDescription,
        htmlContent: editor.getHtml(),
        cssContent: editor.getCss(),
        gjsData: editor.getProjectData(),
      }

      if (templateId) {
        const response = await updateTemplate(templateId, pageData)
        if (!response) {
          throw {
            type: 'server',
            message: 'Failed to update template - no response received',
            statusCode: 500,
          } as ServerError
        }

        handleSuccessfulSave('Template updated successfully')
      } else {
        const savedTemplate = await createTemplate(pageData)
        if (!savedTemplate?.id) {
          throw {
            type: 'server',
            message: 'Failed to create template - no ID received',
            statusCode: 500,
          } as ServerError
        }

        handleSuccessfulSave('New template created successfully', savedTemplate.id)
      }
    } catch (error) {
      handleSaveError(error)
    }
  }

  const validateTemplateData = (): PayloadValidationError | null => {
    if (!templateName.trim()) {
      return {
        type: 'validation',
        message: 'Please enter a template name',
      }
    }

    if (!editor?.getHtml()) {
      return {
        type: 'validation',
        message: 'Template content cannot be empty',
      }
    }

    return null
  }

  const handleSuccessfulSave = (message: string, newTemplateId?: string): void => {
    setHasUnsavedChanges(false)
    setSaveStatus('saved')
    setShowSaveDialog(false)
    toast.success(message)

    if (newTemplateId) {
      router.push(`/editor/${newTemplateId}`)
    }

    // Reset save status after 2 seconds
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  const handleSaveError = (error: unknown): void => {
    setSaveStatus('error')
    console.error('Error saving template:', error)

    if (isTemplateError(error)) {
      switch (error.type) {
        case 'validation':
          toast.error(error.message)
          break
        case 'server':
          toast.error(`Server error: ${error.message}`)
          break
        case 'network':
          toast.error('Network error: Please check your connection')
          break
      }
    } else {
      toast.error('An unexpected error occurred while saving')
    }
  }

  // Type guard for TemplateError
  const isTemplateError = (error: unknown): error is TemplateError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error &&
      typeof (error as TemplateError).message === 'string'
    )
  }

  useEffect(() => {
    if (!editor) return

    editor.on('block:drag:start', (block) => {
      const type = block.get('type')
      if (['hero-banner', 'service-card', 'doctor-profile'].includes(type)) {
        editor.setDragMode('absolute')
      }
    })

    editor.on('block:drag:stop', () => {
      editor.setDragMode('translate')
    })
  }, [editor])

  return (
    <div className={styles.editorWrapper}>
      <div className={`${styles.panelTop} panel__top custom-panel-top`}>
        <div className={styles.panelBasicActions}>
          <button
            onClick={() => router.push('/template-list')}
            className="ml-0 mr-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors p-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-500 hover:text-gray-900" />
          </button>
          <div className="flex flex-col gap-1 ">
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              {templateName || 'Untitled Template'}
            </h1>
            <p className="text-sm text-gray-600 line-clamp-2">
              {templateDescription || 'No description provided'}
            </p>
          </div>
        </div>
        <div className={styles.panelRightActions}>
          <button onClick={() => setShowSaveDialog(true)} className={styles.customSaveButton}>
            <CloudUploadIcon className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>
      <div ref={editorRef} className={styles.customGjsEditor} />
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${styles.modalContent} bg-white rounded-lg p-6 w-full max-w-md`}>
            <div className={`${styles.modalHeader} flex justify-between items-center mb-4`}>
              <h3 className="text-lg font-semibold">Save Template</h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className={`${styles.modalClose} text-gray-500 hover:text-gray-700`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`${styles.inputLabel} block text-sm font-medium text-gray-700 mb-1`}
                >
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className={`${styles.input} w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label
                  className={`${styles.inputLabel} block text-sm font-medium text-gray-700 mb-1`}
                >
                  Description
                </label>
                <input
                  type="text"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                  className={`${styles.input} w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`text-sm ${
                    saveStatus === 'error'
                      ? styles.statusError
                      : saveStatus === 'saved'
                        ? styles.statusSuccess
                        : saveStatus === 'saving'
                          ? styles.statusSaving
                          : styles.statusIdle
                  }`}
                >
                  {saveStatus === 'error' && 'Failed to save'}
                  {saveStatus === 'saved' && 'Saved successfully'}
                  {saveStatus === 'saving' && 'Saving...'}
                </span>

                <button
                  onClick={handleSaveTemplate}
                  disabled={saveStatus === 'saving'}
                  className={`${styles.saveButton} ${
                    saveStatus === 'saving' ? styles.saveButtonDisabled : ''
                  }`}
                >
                  {saveStatus === 'saving'
                    ? 'Saving...'
                    : templateId
                      ? 'Update Template'
                      : 'Save Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor
