'use client'

import { useEffect, useRef, useState } from 'react'
import grapesjs, {
  BlockProperties,
  ComponentDefinition,
  Editor as GrapesEditor,
  ProjectData,
} from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import './Editor.globals.css'
import {
  ArrowLeft,
  CloudUploadIcon,
  ChevronDown,
  CheckCircle2,
  Clock,
  Archive,
  Check,
  X,
  Pencil,
  Copy,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/(frontend)/_components/ui/dropdown-menu'
import { Button } from '@/app/(frontend)/_components/ui/button'
import { Badge } from '@/app/(frontend)/_components/ui/badge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { customBlocks } from './blocks'
import { EditorProps } from './utils/types'
import { getEditorConfig } from './utils/editorConfig'
import { useTemplateData, useEditorSetup } from './utils/hooks'
import { ValidationError as PayloadValidationError } from 'payload'
import { ServerError, NetworkError } from './utils/types'
import {
  createTemplate,
  updateTemplate,
  updateTemplateStatus,
} from '@/app/(frontend)/_actions/templates'
import { fetchImages } from '@/app/(frontend)/_actions/images'
import type { PayloadImage } from '@/app/(frontend)/_actions/images'
import type { TemplateData } from '@/app/(frontend)/_types/template-data'
import { TEMPLATE_STATUS, TemplateStatus } from '@/app/(frontend)/_types/template'
import { generateSlug } from '@/lib/utils/slug-generator'

type TemplateError = PayloadValidationError | ServerError | NetworkError

const statusConfig = {
  draft: {
    label: 'Draft',
    icon: Clock,
    className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  },
  published: {
    label: 'Published',
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    className: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
  },
}

const Editor = ({ templateId, mode = 'edit' }: EditorProps) => {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<GrapesEditor | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [images, setImages] = useState<PayloadImage[]>([])
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published' | 'error'>(
    'idle',
  )
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')

  const {
    initialData,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    slug: {
      value: slugValue,
      isEditing: isSlugEditing,
      tempValue: slugTempValue,
      handleSlugChange,
      startSlugEdit,
      cancelSlugEdit,
      saveSlug,
      syncSlug,
    },
    status: currentStatus,
    setStatus: setCurrentStatus,
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

    // editorInstance.Components.addType('script', {
    //   view: {
    //     onRender({ el }: { el: HTMLElement }) {
    //       el.innerHTML = `<div class="script-block">
    //                 <div class="script-block__header">
    //                   <i class="fa fa-code"></i> Script
    //                 </div>
    //                 <div class="script-block__content">
    //                   <pre>${el.textContent}</pre>
    //                 </div>
    //               </div>`
    //     },
    //   },
    //   model: {
    //     defaults: {
    //       tagName: 'script',
    //       draggable: true,
    //       droppable: false,
    //       attributes: { type: 'text/javascript' },
    //       traits: [
    //         {
    //           type: 'textarea',
    //           name: 'content',
    //           label: 'Script Content',
    //         },
    //       ],
    //     } as ComponentDefinition,
    //   },
    // })
    // Add custom blocks
    customBlocks.forEach((block) => {
      if (block?.id) {
        editorInstance.BlockManager.add(block.id, block as BlockProperties)
      }
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
      editorInstance.destroy()
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef.current, initialData])

  // Setup editor configurations and cleanup
  useEditorSetup(editor, mode)

  const handleChange = () => {
    setHasUnsavedChanges(true)
  }

  useEffect(() => {
    if (!editor) return

    editor.on('component:update', handleChange)
    editor.on('style:update', handleChange)
    editor.on('canvas:update', handleChange)
    editor.on('block:drag:start', (block) => {
      const type = block.get('type')
      if (['hero-banner', 'service-card', 'doctor-profile'].includes(type)) {
        editor.setDragMode('absolute')
      }
    })
    editor.on('block:drag:stop', () => {
      editor.setDragMode('translate')
    })

    editor.on('component:add', (component) => {
      if (component.get('type') === 'script') {
        // Handle script addition
        console.log('Script added:', component.get('content'))
      }
    })

    editor.on('component:update', (component) => {
      if (component.get('type') === 'script') {
        // Handle script updates
        console.log('Script updated:', component.get('content'))
      }
    })

    // Add custom command for script execution
    editor.Commands.add('execute-script', {
      run: (editor, sender, options = {}) => {
        const component = options.component
        if (component && component.get('type') === 'script') {
          try {
            const content = component.get('content')
            // Execute script in a safe context
            const func = new Function(content)
            func()
          } catch (error) {
            console.error('Script execution error:', error)
            toast.error('Script execution failed')
          }
        }
      },
    })

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
        slug: slugTempValue || templateId || '',
        htmlContent: editor.getHtml(),
        cssContent: editor.getCss(),
        gjsData: editor.getProjectData(),
        status: currentStatus,
        access: {
          visibility: 'public',
        },
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

        handleSuccessfulSave('Template updated successfully', undefined, slugTempValue)
      } else {
        const savedTemplate = await createTemplate(pageData)
        if (!savedTemplate?.id) {
          throw {
            type: 'server',
            message: 'Failed to create template - no ID received',
            statusCode: 500,
          } as ServerError
        }
        await updateTemplate(savedTemplate.id, { slug: savedTemplate.id })
        handleSuccessfulSave('New template created successfully', savedTemplate.id, slugTempValue)
      }
    } catch (error) {
      handleSaveError(error)
    }
  }

  const validateTemplateData = (): PayloadValidationError | null => {
    if (!templateName.trim()) {
      return {
        name: 'validation',
        message: 'Please enter a template name',
        data: {
          errors: [{ message: 'Template name is required', path: 'title' }],
        },
        isOperational: true,
        isPublic: true,
        status: 400,
      }
    }

    if (!editor?.getHtml()) {
      return {
        name: 'validation',
        message: 'Template content cannot be empty',
        data: {
          errors: [{ message: 'Template content is required', path: 'content' }],
        },
        isOperational: true,
        isPublic: true,
        status: 400,
      }
    }

    return null
  }

  const handleSuccessfulSave = (
    message: string,
    newTemplateId?: string,
    slugValue: string = newTemplateId || '',
  ): void => {
    syncSlug(slugValue)
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
      if ('name' in error && error.name === 'validation') {
        toast.error(error.message)
      } else if ('type' in error) {
        switch (error.type) {
          case 'server':
            toast.error(`Server error: ${error.message}`)
            break
          case 'network':
            toast.error('Network error: Please check your connection')
            break
        }
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

  const handleStatusChange = async (newStatus: TemplateStatus) => {
    if (!templateId) {
      toast.error('Please save the template before changing status')
      return
    }

    if (newStatus === TEMPLATE_STATUS.PUBLISHED && !slugValue.trim()) {
      toast.error('Please set a URL slug before publishing')
      return
    }

    try {
      setPublishStatus('publishing')

      if (newStatus === TEMPLATE_STATUS.PUBLISHED) {
        await updateTemplate(templateId, {
          status: newStatus,
          slug: slugValue,
        })
      } else {
        await updateTemplateStatus(templateId, newStatus)
      }

      setCurrentStatus(newStatus)
      setPublishStatus('published')
      toast.success(`Template ${newStatus} successfully`)
      router.refresh()
    } catch (error) {
      setPublishStatus('error')
      toast.error(`Failed to ${newStatus} template`)
      console.error(`Error ${newStatus} template:`, error)
    }
  }

  const StatusChip = () => {
    const config = statusConfig[currentStatus]
    const Icon = config.icon

    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const handleCopyUrl = async () => {
    try {
      const baseUrl = window.location.origin
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const templateUrl = `${baseUrl}${basePath}/pages/${slugValue}`
      await navigator.clipboard.writeText(templateUrl)
      setCopyStatus('copied')
      toast.success('URL copied to clipboard')

      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus('idle')
      }, 2000)
    } catch (error) {
      toast.error('Failed to copy URL')
      console.error('Copy failed:', error)
    }
  }

  return (
    <div className="editor-wrapper">
      <div className="editor-panel-top">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="editor-back-button">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="admin-divider" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="editor-title">{templateName || 'Untitled Template'}</h1>
              <StatusChip />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">/pages/</span>
              {isSlugEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={slugTempValue}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="h-6 px-1 text-sm border rounded bg-background"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveSlug()
                      } else if (e.key === 'Escape') {
                        cancelSlugEdit()
                      }
                    }}
                  />
                  <button
                    onClick={() => saveSlug()}
                    className="p-1 text-green-500 hover:text-green-600 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelSlugEdit}
                    className="p-1 text-red-500 hover:text-red-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group">
                  <span className="text-sm font-mono">{slugValue || 'no-slug'}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={startSlugEdit}
                      className="p-1 text-muted-foreground hover:text-foreground rounded"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleCopyUrl}
                      className="p-1 text-muted-foreground hover:text-foreground rounded"
                      title="Copy URL to clipboard"
                    >
                      {copyStatus === 'copied' ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="editor-description mt-1">
              {templateDescription || 'No description provided'}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="editor-status-button"
              disabled={publishStatus === 'publishing' || !templateId}
            >
              <CloudUploadIcon className="w-4 h-4" />
              <span className="px-1">
                {publishStatus === 'publishing' ? 'Processing...' : 'Manage Status'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="editor-status-dropdown">
            <DropdownMenuItem
              onClick={() => handleStatusChange(TEMPLATE_STATUS.DRAFT)}
              className="editor-status-item group"
            >
              <Clock className="text-yellow-500 group-hover:text-yellow-600" />
              Set as Draft
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(TEMPLATE_STATUS.PUBLISHED)}
              className="editor-status-item group"
            >
              <CheckCircle2 className="text-green-500 group-hover:text-green-600" />
              Publish
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(TEMPLATE_STATUS.ARCHIVED)}
              className="editor-status-item group"
            >
              <Archive className="text-gray-500 group-hover:text-gray-600" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="editor-content">
        <div ref={editorRef} className="editor-container" />
      </div>
      {showSaveDialog && (
        <div className="editor-modal-overlay">
          <div className="editor-modal">
            <div className="editor-modal-header">
              <h3 className="editor-modal-title">Save Template</h3>
              <button onClick={() => setShowSaveDialog(false)} className="editor-modal-close">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="editor-form-field">
                <label className="editor-form-label">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="editor-form-input"
                />
              </div>

              <div className="editor-form-field">
                <label className="editor-form-label">URL Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slugTempValue}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="custom-url-slug"
                    className="editor-form-input flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const generatedSlug = await generateSlug(templateName)
                      handleSlugChange(generatedSlug)
                    }}
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used in the URL: /pages/
                  <span className="font-mono">{slugValue || 'your-slug'}</span>
                </p>
              </div>

              <div className="editor-form-field">
                <label className="editor-form-label">Description</label>
                <input
                  type="text"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                  className="editor-form-input"
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`editor-status-text ${
                    saveStatus === 'error'
                      ? 'editor-status-error'
                      : saveStatus === 'saved'
                        ? 'editor-status-success'
                        : saveStatus === 'saving'
                          ? 'editor-status-saving'
                          : 'editor-status-idle'
                  }`}
                >
                  {saveStatus === 'error' && 'Failed to save'}
                  {saveStatus === 'saved' && 'Saved successfully'}
                  {saveStatus === 'saving' && 'Saving...'}
                </span>

                <button
                  onClick={handleSaveTemplate}
                  disabled={saveStatus === 'saving'}
                  className={`editor-save-button ${
                    saveStatus === 'saving' ? 'editor-save-button-disabled' : ''
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
