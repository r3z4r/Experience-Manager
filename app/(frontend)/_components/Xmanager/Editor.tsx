'use client'

import { useEffect, useRef, useState } from 'react'
import grapesjs, {
  BlockProperties,
  Editor as GrapesEditor,
  ProjectData,
  TraitProperties,
  Component as GrapesComponent,
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
import { StatusChip } from './StatusChip'
import { SaveModal } from './SaveModal'
import { getAssetManagerConfig } from './utils/assetConfig'

type TemplateError = PayloadValidationError | ServerError | NetworkError

// TODO: Fix this
interface CustomTrait extends Partial<TraitProperties> {
  onChange?: (params: { component: GrapesComponent; value: any }) => void
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

    editorInstance.Components.addType('script', {
      view: {
        onRender({ el, model }) {
          // Get the actual script content
          const scriptContent = model.components().models[0]?.get('content') || ''

          // Update the content display
          el.innerHTML = `
            <div class="script-block">
              <div class="script-block__header">
                <i class="fa fa-code"></i> Script
              </div>
              <div class="script-block__content">
                <pre>${scriptContent}</pre>
              </div>
            </div>
          `
        },
      },
      model: {
        defaults: {
          tagName: 'script',
          draggable: true,
          droppable: false,
          layerable: true,
          selectable: true,
          hoverable: true,
          attributes: { type: 'text/javascript' },
          components: [
            {
              type: 'textnode',
              content: '// Your JavaScript code here',
            },
          ],
          traits: [
            {
              type: 'textarea',
              name: 'scriptContent',
              label: 'Script Content',
              changeProp: true,
              onChange({ component, value }) {
                const textNode = component.components().models[0]
                if (textNode) {
                  textNode.set('content', value)
                  component.view?.render()
                }
              },
            },
          ] as CustomTrait[],
        },
        init() {
          // Set up initial content
          const textNode = this.components().models[0]
          if (textNode) {
            this.set('scriptContent', textNode.get('content'))
          }

          // Listen for content changes
          this.on('change:scriptContent', this.handleContentChange)
        },
        handleContentChange() {
          const content = this.get('scriptContent')
          const textNode = this.components().models[0]
          if (textNode && content !== textNode.get('content')) {
            textNode.set('content', content)
            this.view?.render()
          }
        },
      },
    })

    // Add custom blocks
    customBlocks.forEach((block) => {
      if (block?.id) {
        editorInstance.BlockManager.add(block.id, block as BlockProperties)
      }
    })

    // Additional setup after editor is loaded
    editorInstance.on('load', () => {
      // Add custom command for script execution
      editorInstance.Commands.add('execute-script', {
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

    // Update asset manager configuration
    const assetManagerConfig = getAssetManagerConfig(editorInstance, images)
    Object.assign(editorInstance.AssetManager.getConfig(), assetManagerConfig)
    editorInstance.AssetManager.render() // Re-render asset manager with new config

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
              <StatusChip status={currentStatus} />
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
        <SaveModal
          templateId={templateId}
          initialName={templateName}
          initialDescription={templateDescription}
          slugValue={slugValue}
          slugTempValue={slugTempValue}
          onSlugChange={handleSlugChange}
          onClose={() => setShowSaveDialog(false)}
          onSave={(name, description) => {
            setTemplateName(name)
            setTemplateDescription(description)
            handleSaveTemplate()
          }}
          saveStatus={saveStatus}
        />
      )}
    </div>
  )
}

export default Editor
