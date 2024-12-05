'use client'

import { useEffect, useRef, useState } from 'react'
import grapesjs, { Editor as GrapesEditor, ProjectData } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import './Editor.globals.css'
import styles from './Editor.module.css'
import webpage from 'grapesjs-preset-webpage'
import basicBlocks from 'grapesjs-blocks-basic'
import flexbox from 'grapesjs-blocks-flexbox'
import forms from 'grapesjs-plugin-forms'
import styleFilter from 'grapesjs-style-filter'
// import { templateBlocks, commonStyles } from './default-template'
import { SaveIcon, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  fetchTemplateById,
  updateTemplate,
  createTemplate,
  TemplateData,
} from '@/app/(frontend)/_actions/templates'
import { toast } from 'sonner'
import { customBlocks } from './blocks'

interface EditorProps {
  templateId?: string
  mode?: 'edit' | 'view'
}

interface ValidationError {
  type: 'validation'
  message: string
}

interface ServerError {
  type: 'server'
  message: string
  statusCode?: number
}

interface NetworkError {
  type: 'network'
  message: string
}

type TemplateError = ValidationError | ServerError | NetworkError

const Editor = ({ templateId, mode = 'edit' }: EditorProps) => {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<GrapesEditor | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialData, setInitialData] = useState<{
    html: string
    css: string
    gjsData?: unknown
  } | null>(null)

  // Fetch data before editor initialization
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

  useEffect(() => {
    if (!editorRef.current || !initialData) return

    const editorConfig = {
      container: editorRef.current,
      fromElement: true,
      height: '93vh',
      width: '100%',

      // Storage manager configuration
      storageManager: {
        type: 'remote',
        autosave: true,
        autoload: false, // Disable autoload since we're loading manually
        stepsBeforeSave: 2,
        options: {
          remote: {
            onStore: async (data: unknown) => {
              try {
                const templateData = {
                  title: templateName,
                  description: templateDescription,
                  htmlContent: editor?.getHtml() || '',
                  cssContent: editor?.getCss() || '',
                  gjsData: data,
                }

                if (templateId) {
                  await updateTemplate(templateId, templateData)
                } else {
                  const newTemplate = await createTemplate(templateData)
                  if (newTemplate?.id) {
                    router.replace(`/editor/${newTemplate.id}`)
                  }
                }

                setHasUnsavedChanges(false)
                toast.success(templateId ? 'Template updated' : 'Template created')
                return true
              } catch (error) {
                console.error('Error saving template:', error)
                toast.error('Failed to save template')
                return false
              }
            },
          },
        },
      },
      plugins: [webpage, basicBlocks, flexbox, forms, styleFilter],
      pluginsOpts: {
        [webpage]: {
          blocks: ['link-block', 'quote', 'text-basic'],
          modalImportButton: true,
          modalImportLabel: 'Import',
          modalImportContent: '',
        },
        [basicBlocks]: {
          blocks: [
            'column1',
            'column2',
            'column3',
            'column3-7',
            'text',
            'link',
            'image',
            'video',
            'map',
          ],
          flexGrid: true,
        },
        [flexbox]: {
          flexboxBlock: {
            label: 'Flexbox Container',
            category: 'Layout',
            attributes: {
              class: 'flex-container',
            },
            content: `
              <div class="flex-container" data-gjs-droppable="true" data-gjs-custom-name="Flex Container">
                <div class="flex-item" data-gjs-draggable="true" data-gjs-custom-name="Flex Item">Item 1</div>
                <div class="flex-item" data-gjs-draggable="true" data-gjs-custom-name="Flex Item">Item 2</div>
                <div class="flex-item" data-gjs-draggable="true" data-gjs-custom-name="Flex Item">Item 3</div>
              </div>
            `,
          },
        },
        [forms]: {
          blocks: ['form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio'],
        },
        [styleFilter]: {
          filterTypes: [
            { name: 'blur' },
            { name: 'brightness' },
            { name: 'contrast' },
            { name: 'grayscale' },
            { name: 'hue-rotate' },
            { name: 'invert' },
            { name: 'opacity' },
            { name: 'saturate' },
            { name: 'sepia' },
          ],
        },
      },
      styleManager: {
        sectors: [
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'min-height', 'padding', 'margin'],
          },
          {
            name: 'Flex',
            open: false,
            buildProps: [
              'flex-direction',
              'flex-wrap',
              'justify-content',
              'align-items',
              'align-content',
              'order',
              'flex-basis',
              'flex-grow',
              'flex-shrink',
              'align-self',
            ],
          },
          {
            name: 'Extra',
            open: false,
            buildProps: ['opacity', 'transition', 'transform'],
          },
          {
            name: 'Flex Container',
            open: true,
            buildProps: [
              'display',
              'flex-direction',
              'flex-wrap',
              'justify-content',
              'align-items',
              'align-content',
              'gap',
            ],
            properties: [
              {
                name: 'Display',
                property: 'display',
                type: 'select',
                defaults: 'flex',
                options: [
                  { value: 'flex', name: 'Flex' },
                  { value: 'inline-flex', name: 'Inline Flex' },
                ],
              },
              {
                name: 'Direction',
                property: 'flex-direction',
                type: 'select',
                defaults: 'row',
                options: [
                  { value: 'row', name: 'Row' },
                  { value: 'row-reverse', name: 'Row Reverse' },
                  { value: 'column', name: 'Column' },
                  { value: 'column-reverse', name: 'Column Reverse' },
                ],
              },
              {
                name: 'Wrap',
                property: 'flex-wrap',
                type: 'select',
                defaults: 'nowrap',
                options: [
                  { value: 'nowrap', name: 'No Wrap' },
                  { value: 'wrap', name: 'Wrap' },
                  { value: 'wrap-reverse', name: 'Wrap Reverse' },
                ],
              },
              {
                name: 'Justify',
                property: 'justify-content',
                type: 'select',
                defaults: 'flex-start',
                options: [
                  { value: 'flex-start', name: 'Start' },
                  { value: 'flex-end', name: 'End' },
                  { value: 'center', name: 'Center' },
                  { value: 'space-between', name: 'Space Between' },
                  { value: 'space-around', name: 'Space Around' },
                  { value: 'space-evenly', name: 'Space Evenly' },
                ],
              },
              {
                name: 'Items Align',
                property: 'align-items',
                type: 'select',
                defaults: 'stretch',
                options: [
                  { value: 'flex-start', name: 'Start' },
                  { value: 'flex-end', name: 'End' },
                  { value: 'center', name: 'Center' },
                  { value: 'baseline', name: 'Baseline' },
                  { value: 'stretch', name: 'Stretch' },
                ],
              },
              {
                name: 'Gap',
                property: 'gap',
                type: 'slider',
                defaults: '10px',
                min: 0,
                max: 100,
                step: 1,
              },
            ],
          },
          {
            name: 'Flex Item',
            open: true,
            buildProps: ['flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'order'],
            properties: [
              {
                name: 'Grow',
                property: 'flex-grow',
                type: 'number',
                defaults: 0,
                min: 0,
                max: 10,
              },
              {
                name: 'Shrink',
                property: 'flex-shrink',
                type: 'number',
                defaults: 1,
                min: 0,
                max: 10,
              },
              {
                name: 'Basis',
                property: 'flex-basis',
                type: 'slider',
                units: ['px', '%', 'auto'],
                defaults: 'auto',
                min: 0,
                max: 100,
              },
              {
                name: 'Self Align',
                property: 'align-self',
                type: 'select',
                defaults: 'auto',
                options: [
                  { value: 'auto', name: 'Auto' },
                  { value: 'flex-start', name: 'Start' },
                  { value: 'flex-end', name: 'End' },
                  { value: 'center', name: 'Center' },
                  { value: 'baseline', name: 'Baseline' },
                  { value: 'stretch', name: 'Stretch' },
                ],
              },
              {
                name: 'Order',
                property: 'order',
                type: 'number',
                defaults: 0,
                min: -10,
                max: 10,
              },
            ],
          },
        ],
      },
      panels: {
        defaults: [
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: 'Desktop',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
              },
              {
                id: 'device-tablet',
                label: 'Tablet',
                command: 'set-device-tablet',
                togglable: false,
              },
              {
                id: 'device-mobile',
                label: 'Mobile',
                command: 'set-device-mobile',
                togglable: false,
              },
            ],
          },
          {
            id: 'panel-basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true,
                className: 'btn-toggle-borders',
                label: 'Borders',
                command: 'sw-visibility',
              },
              {
                id: 'export',
                className: 'btn-open-export',
                label: 'Export',
                command: 'export-template',
              },
              {
                id: 'show-json',
                className: 'btn-show-json',
                label: 'JSON',
                context: 'show-json',
                command(editor) {
                  editor.Modal.setTitle('Components JSON')
                    .setContent(
                      `<textarea style="width:100%; height: 250px;">
                        ${JSON.stringify(editor.getComponents(), null, 2)}
                      </textarea>`,
                    )
                    .open()
                },
              },
            ],
          },
          {
            id: 'panel-styles',
            el: '.panel__right',
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: 0,
              cl: 1,
              cr: 0,
              bc: 0,
              keyWidth: 'flex-basis',
            },
          },
        ],
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Tablet',
            width: '768px',
            widthMedia: '991px',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '320px',
          },
        ],
      },
      blockManager: {
        blocks: [
          ...customBlocks.map((block) => ({
            id: block.id,
            label: block.label,
            category: block.category,
            content: block.content,
            style: block.css,
            attributes: block.attributes || {},
            media: block.media || `<div class="gjs-block-label">${block.label}</div>`,
          })),
        ],
      },
      containerScroll: true,
      customClass: styles.customGjsEditor,
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        ],
        // customStyles: `
        //    ${commonStyles}
        //   `,
      },
      componentsOpts: {
        wrapper: {
          stylable: [
            'background',
            'background-color',
            'background-image',
            'background-repeat',
            'background-attachment',
            'background-position',
            'background-size',
          ],
          removable: false,
          copyable: false,
          draggable: false,
          // style: commonStyles,
        },
      },
      assetManager: {
        assets: [
          // Logo
          {
            type: 'image',
            src: '/logo.webp',
            height: 40,
            width: 180,
            category: 'Logos',
          },
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/media/sparsh/banner/image/i/m/image_-_1_1.jpg',
            height: 350,
            width: 250,
            category: 'Banner Images',
          },
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/app/_next/image?url=https%3A%2F%2Fmoments-healthcare.tecnotree.com%2Fmedia%2Fcatalog%2Fproduct%2Ft%2Fh%2Ftherapy_session.jpg&w=1920&q=75',
            height: 350,
            width: 250,
            category: 'Hero Images',
          },
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/app/_next/image?url=%2Fapp%2Fassets%2Fimages%2FAppointBooking.png&w=1920&q=75',
            height: 350,
            width: 250,
            category: 'Hero Images',
          },
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/media/sparsh/banner/image/i/m/image_-_6.jpg',
            height: 350,
            width: 250,
            category: 'Banner Images',
          },
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/media/sparsh/banner/image/i/m/image_-_5.jpg',
            height: 350,
            width: 250,
            category: 'Banner Images',
          },
          // Doctor Images
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/media/sparsh/banner/image/i/m/image_-_4.jpg',
            height: 350,
            width: 250,
            category: 'Doctor Images',
          },
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/media/sparsh/banner/image/i/m/image_-_3.jpg',
            height: 350,
            width: 250,
            category: 'Doctor Images',
          },
          // Service Images
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/media/sparsh/banner/image/i/m/image_-_2.jpg',
            height: 350,
            width: 250,
            category: 'Service Images',
          },
          {
            type: 'image',
            src: 'https://moments-healthcare.tecnotree.com/media/sparsh/banner/image/i/m/image_-_1.jpg',
            height: 350,
            width: 250,
            category: 'Service Images',
          },
        ],
        upload: false,
        modalTitle: 'Select Image',
        addBtnText: 'Add Image',
        categories: [
          { id: 'hero', label: 'Hero Images' },
          { id: 'doctors', label: 'Doctor Images' },
          { id: 'services', label: 'Service Images' },
          { id: 'logos', label: 'Logos' },
        ],
      },
    }

    const editor = grapesjs.init(editorConfig)
    if (
      initialData?.gjsData &&
      initialData.gjsData !== '' &&
      typeof initialData.gjsData === 'object'
    ) {
      const projectData: ProjectData = initialData.gjsData as ProjectData
      editor.loadProjectData(projectData)
    }

    // Additional setup after editor is loaded
    editor.on('load', () => {
      // Set up commands, panels, etc.
      editor.Commands.add('save-template', {
        run: () => setShowSaveDialog(true),
      })
      // Additional editor customizations
      editor.Panels.addButton('options', {
        id: 'save-db',
        className: 'fa fa-floppy-o ',
        command: 'save-template',
        attributes: { title: 'Save Template' },
      })
    })

    setEditor(editor)

    return () => editor.destroy()
  }, [templateId, initialData, router])

  useEffect(() => {
    if (mode === 'view') {
      // Disable editing capabilities
    }
  }, [mode])

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

  const validateTemplateData = (): ValidationError | null => {
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
    <>
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
              <SaveIcon className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
        <div ref={editorRef} className={styles.customGjsEditor} />
      </div>

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
    </>
  )
}

export default Editor
