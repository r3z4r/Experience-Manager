'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
import { TEMPLATE_STATUS, TemplateStatus } from '@/app/(frontend)/_types/template'
import { StatusChip } from './StatusChip'
import { SaveModal } from './SaveModal'
import { getAssetManagerConfig } from './utils/assetConfig'
import { getCustomBlocks } from './blocks'
import { ScriptEditor } from './panels/ScriptEditor'
import type { Page } from '@/payload-types'
import { useUser } from '@/app/(frontend)/_context/UserContext'

type TemplateError = PayloadValidationError | ServerError | NetworkError

// TODO: Fix this
interface CustomTrait extends Partial<TraitProperties> {
  onChange?: (params: { component: GrapesComponent; value: any }) => void
}

const Editor = ({ templateId, mode = 'edit' }: EditorProps) => {
  const router = useRouter()
  const { user } = useUser()
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
  const [blocks, setBlocks] = useState<BlockProperties[]>([])

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
    const initBlocks = async () => {
      const customBlocks = await getCustomBlocks()
      setBlocks(customBlocks)
    }
    initBlocks()
  }, [])

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchImages()
        setImages(fetchedImages ?? [])
      } catch (error: unknown) {
        console.error('Error loading images:', error)
      }
    }

    loadImages()
  }, [])

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current || !blocks.length) return

    const editorInstance = grapesjs.init(
      getEditorConfig(
        editorRef.current,
        editor,
        templateName ?? '',
        templateDescription ?? '',
        templateId,
        setHasUnsavedChanges,
        (newTemplateId) => router.replace(`/dashboard/editor/${newTemplateId}`),
        images,
        blocks,
      ),
    )

    editorInstance.setStyle(initialData?.css || '')
    editorInstance.setComponents(initialData?.html || '')

    if (initialData?.gjsData) {
      editorInstance.loadProjectData(initialData.gjsData as ProjectData)
    }

    // Import stored JavaScript content if available
    // Cast initialData to access potential jsContent property
    const extendedInitialData = initialData as typeof initialData & { jsContent?: string }

    if (extendedInitialData?.jsContent && extendedInitialData.jsContent.trim() !== '') {
      // Parse the jsContent into individual scripts
      const scriptBlocks = extendedInitialData.jsContent
        .split(/\/\* Script \d+ \*\//)
        .filter((script: string) => script.trim() !== '')

      console.log('Restoring', scriptBlocks.length, 'script blocks from stored jsContent')

      if (scriptBlocks.length > 0) {
        // Create a script component for each block
        scriptBlocks.forEach((scriptContent: string, index: number) => {
          const trimmedContent = scriptContent.trim()
          if (trimmedContent) {
            const wrapper = editorInstance.Components.getWrapper()
            if (wrapper) {
              // Create a new script component with the stored content
              wrapper.append({
                type: 'script',
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
                    content: trimmedContent,
                  },
                ],
              })

              console.log(`Restored script ${index + 1}`)
            }
          }
        })
      }
    }

    // Register script component type
    editorInstance.Components.addType('script', {
      view: {
        onRender({ el, model }) {
          // Get the actual script content
          const scriptContent = model.components().models[0]?.get('content') || ''
          const truncatedContent =
            scriptContent.length > 150 ? scriptContent.substring(0, 150) + '...' : scriptContent

          // Extract first line as title (if it's a comment)
          const firstLine = scriptContent.split('\n')[0]
          const title = firstLine.startsWith('//') ? firstLine.substring(2).trim() : 'JavaScript'

          // Update the content display
          el.innerHTML = `
            <div class="script-block">
              <div class="script-block__header">
                <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 4px;">
                  <path fill="currentColor" d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z"/>
                </svg>
                ${title}
              </div>
              <div class="script-block__content">
                <pre>${truncatedContent}</pre>
              </div>
              <div style="position: absolute; bottom: 4px; right: 4px; font-size: 10px; color: #666;">
                Double-click to edit
              </div>
            </div>
          `

          // Add double-click handler for opening the script editor
          el.addEventListener('dblclick', (e) => {
            e.preventDefault()
            e.stopPropagation()
            editorInstance.Commands.run('open-script-editor', { component: model })
          })
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
              content:
                '// Your JavaScript code here\n// This code will run when the page loads\n\nconsole.log("Script initialized");',
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
            {
              type: 'button',
              text: 'Edit Script',
              full: true,
              command: (editor) => {
                const selectedComponent = editor.getSelected()
                if (selectedComponent && selectedComponent.get('type') === 'script') {
                  editor.Commands.run('open-script-editor', { component: selectedComponent })
                }
              },
            },
            {
              type: 'button',
              text: 'Test Run',
              full: true,
              command: (editor) => {
                const selectedComponent = editor.getSelected()
                if (selectedComponent && selectedComponent.get('type') === 'script') {
                  try {
                    const content = selectedComponent.components().models[0]?.get('content') || ''
                    const func = new Function(content)
                    func()
                    editor.Modal.open({
                      title: 'Script Executed',
                      content: 'Script executed successfully!',
                    })
                  } catch (error: unknown) {
                    console.error('Script execution error:', error)
                    editor.Modal.open({
                      title: 'Script Error',
                      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    })
                  }
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
    blocks.forEach((block) => {
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
            } catch (error: unknown) {
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

      // Add command to open JavaScript manager dialog
      editorInstance.Commands.add('open-js-manager', {
        run: () => {
          try {
            // Check if Components API is available
            if (!editorInstance.Components) {
              console.error('Editor Components API not available')
              toast.error('JavaScript editor is not available right now')
              return
            }

            // Get wrapper with safety check
            const wrapper = editorInstance.Components.getWrapper()
            if (!wrapper) {
              console.error('Editor wrapper not available')
              // Still dispatch event but with null component
              window.dispatchEvent(
                new CustomEvent('open-script-editor-dialog', {
                  detail: { component: null, editor: editorInstance },
                }),
              )
              return
            }

            // Find any script component to use as a starting point
            const scripts = wrapper.find('[type=script]') || []
            const scriptComponent = Array.isArray(scripts) && scripts.length > 0 ? scripts[0] : null

            // Open the script editor dialog with the found component or null to create new
            window.dispatchEvent(
              new CustomEvent('open-script-editor-dialog', {
                detail: { component: scriptComponent, editor: editorInstance },
              }),
            )
          } catch (error: unknown) {
            console.error('Error opening JavaScript manager:', error)
            toast.error('Could not open JavaScript editor')
          }
        },
      })

      // Add JavaScript editor button to the panel
      editorInstance.Panels.addButton('options', {
        id: 'js-editor',
        className: 'fa fa-file-code-o',
        command: 'open-js-manager',
        attributes: { title: 'JavaScript Manager' },
      })

      // Additional editor customizations
      editorInstance.Panels.addButton('options', {
        id: 'save-db',
        className: 'fa fa-floppy-o ',
        command: 'save-template',
        attributes: { title: 'Save Template' },
      })

      // Add a custom command to refresh the script list
      editorInstance.Commands.add('refresh-script-list', {
        run: () => {
          // Force refresh script components
          window.dispatchEvent(new CustomEvent('refresh-script-list'))
        },
      })

      // Add an event listener for script-related operations
      editorInstance.on('component:add', (component) => {
        if (component.get('type') === 'script') {
          // Trigger script list refresh when a script is added
          setTimeout(() => {
            editorInstance.Commands.run('refresh-script-list')
          }, 100)
        }
      })
      // Ensure script components are properly handled during save/load
      editorInstance.on('storage:start:store', (data) => {
        try {
          // Handle script components specially to avoid circular references
          if (data && data.components) {
            const processComponents = (components: any[]): any[] => {
              if (!Array.isArray(components)) return components

              return components.map((comp) => {
                // Create a clean copy of the component
                const cleanComp = { ...comp }

                // Handle script components specially
                if (cleanComp.type === 'script') {
                  // Ensure script content is preserved but other circular references are removed
                  const scriptContent = cleanComp.components?.[0]?.content || ''
                  cleanComp.components = [{ type: 'textnode', content: scriptContent }]
                } else if (cleanComp.components) {
                  // Process nested components recursively
                  cleanComp.components = processComponents(cleanComp.components)
                }

                return cleanComp
              })
            }

            // Process top-level components
            data.components = processComponents(data.components)
          }
        } catch (error: unknown) {
          console.error('Error processing components for storage:', error)
        }
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
  }, [editorRef.current, initialData, blocks])

  // Setup editor configurations and cleanup
  useEditorSetup(editor, mode)

  // Use useCallback to prevent recreating this function on every render
  const handleChange = useCallback(() => {
    setHasUnsavedChanges(true)
  }, [])

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
        // Open script editor when a new script is added
        editor.Commands.run('open-script-editor', { component })
      }
    })

    editor.on('component:update', (component) => {
      if (component.get('type') === 'script') {
        // Handle script updates
        console.log('Script updated:', component.get('content'))
      }
    })

    // Add double-click handler for script components
    editor.on('component:selected', (component) => {
      if (component.get('type') === 'script') {
        // Add double-click event to open script editor
        const el = component.view.el
        if (el && !el.dataset.scriptEditorInitialized) {
          el.dataset.scriptEditorInitialized = 'true'
          el.addEventListener('dblclick', () => {
            editor.Commands.run('open-script-editor', { component })
          })
        }
      }
    })

    // Use the imported blocks
    if (editor.Blocks && typeof editor.Blocks.add === 'function') {
      blocks.forEach((block) => {
        if (block && block.id) {
          try {
            editor.Blocks.add(block.id, block)
          } catch (error) {
            console.error(`Error adding block ${block.id}:`, error)
          }
        }
      })
    } else {
      console.warn('Editor Blocks API not available')
    }

    return () => {
      editor.off('component:update', handleChange)
      editor.off('style:update', handleChange)
      editor.off('canvas:update', handleChange)
    }
  }, [editor, blocks, handleChange])

  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  // Type guard for TemplateError
  const isTemplateError = (error: unknown): error is TemplateError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('type' in error || 'name' in error) &&
      'message' in error &&
      typeof (error as TemplateError).message === 'string'
    )
  }

  // Function to handle successful template save
  const handleSuccessfulSave = useCallback(
    (message: string, newTemplateId?: string, slugValue: string = newTemplateId || ''): void => {
      syncSlug(slugValue)
      setHasUnsavedChanges(false)
      setSaveStatus('saved')
      setShowSaveDialog(false)

      // Show success message only once
      toast.success(message)

      if (newTemplateId) {
        router.push(`/dashboard/editor/${newTemplateId}`)
      }

      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    },
    [router, syncSlug],
  )

  // Function to handle save errors
  const handleSaveError = useCallback((error: unknown): void => {
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
  }, [])

  // Main function to save the template - wrapped in useCallback to prevent recreation on every render
  const handleSaveTemplate = useCallback(async (): Promise<void> => {
    if (!editor) {
      toast.error('Editor is not fully initialized')
      setSaveStatus('error')
      return
    }

    // Validate template data
    if (!templateName.trim()) {
      toast.error('Please enter a template name')
      setSaveStatus('error')
      return
    }

    // Safely check if HTML content exists
    try {
      // Verify that getHtml method exists before calling it
      if (typeof editor.getHtml !== 'function') {
        console.error('Editor getHtml method is not available')
        toast.error('Editor is not fully initialized')
        setSaveStatus('error')
        return
      }

      const htmlContent = editor.getHtml()
      if (!htmlContent) {
        toast.error('Template content cannot be empty')
        setSaveStatus('error')
        return
      }
    } catch (error: unknown) {
      console.error('Error getting HTML content:', error)
      toast.error('Unable to retrieve template content')
      setSaveStatus('error')
      return
    }

    setSaveStatus('saving')

    try {
      // Extract JavaScript content from script components safely
      const extractJavaScriptContent = () => {
        const scripts: string[] = []

        try {
          // Check if editor.Components exists before accessing getWrapper
          if (!editor || !editor.Components) {
            console.error('Editor or Components API not available')
            return ''
          }

          // Extract scripts from components
          const wrapper = editor.Components.getWrapper()
          if (!wrapper) return ''

          const scriptComponents = wrapper.find('[data-gjs-type="script"]')

          if (scriptComponents && scriptComponents.length > 0) {
            for (let i = 0; i < scriptComponents.length; i++) {
              const script = scriptComponents[i]
              if (script.components) {
                const components = script.components()
                if (components && components.models && components.models.length > 0) {
                  const textNode = components.models[0]
                  const content = textNode?.get('content')
                  if (content) {
                    scripts.push(`/* Script ${scripts.length + 1} */\n${content}`)
                  }
                }
              }
            }
          }
          return scripts.join('\n\n')
        } catch (error: unknown) {
          console.error('Error extracting JavaScript content:', error)
          return ''
        }
      }

      const extractedJsContent = extractJavaScriptContent()

      // Safely get HTML, CSS and project data
      let htmlContent = ''
      let cssContent = ''
      let gjsData = {}

      try {
        // Verify editor methods exist before calling them
        if (typeof editor.getHtml === 'function') {
          htmlContent = editor.getHtml() || ''
        }
        if (typeof editor.getCss === 'function') {
          cssContent = editor.getCss() || ''
        }
        if (typeof editor.getProjectData === 'function') {
          gjsData = editor.getProjectData() || {}
        }
      } catch (error: unknown) {
        console.error('Error getting editor content:', error)
      }

      // Using Partial<Page> since server will handle timestamps
      const pageData: Partial<Page> = {
        id: templateId || '',
        title: templateName.trim(),
        description: templateDescription,
        slug: slugTempValue || templateId || '',
        htmlContent,
        cssContent,
        jsContent: extractedJsContent,
        gjsData,
        status: currentStatus,
        access: {
          visibility: 'public',
        },
      }

      if (templateId) {
        // Update existing template
        try {
          const response = await updateTemplate(templateId, pageData)
          if (!response) {
            setSaveStatus('error')
            toast.error('Failed to update template - no response received')
            return
          }

          handleSuccessfulSave('Template updated successfully', undefined, slugTempValue)
        } catch (updateError) {
          handleSaveError(updateError)
          return
        }
      } else {
        // Create new template
        const templateData = {
          title: templateName.trim(),
          description: templateDescription || '',
          htmlContent,
          cssContent,
          jsContent: extractedJsContent,
          gjsData,
          status: currentStatus as 'draft' | 'published' | 'archived',
          access: {
            visibility: 'public' as const,
          },
          slug: slugTempValue || 'temp-slug',
        }

        try {
          const savedTemplate = await createTemplate(templateData)
          if (!savedTemplate?.id) {
            setSaveStatus('error')
            toast.error('Failed to create template - no ID received')
            return
          }

          try {
            await updateTemplate(savedTemplate.id, { slug: savedTemplate.id })
          } catch (slugError: unknown) {
            console.error('Error updating slug:', slugError)
          }

          handleSuccessfulSave('New template created successfully', savedTemplate.id, slugTempValue)
        } catch (createError: unknown) {
          handleSaveError(createError)
          return
        }
      }
    } catch (error: unknown) {
      console.error('Unhandled error in save template flow:', error)
      handleSaveError(error)
    } finally {
      setSaveStatus('idle')
    }
  }, [
    editor,
    templateName,
    templateDescription,
    slugTempValue,
    currentStatus,
    handleSuccessfulSave,
    handleSaveError,
    templateId,
  ])

  useEffect(() => {
    if (editor && templateName && templateDescription) {
      handleSaveTemplate()
    }
  }, [editor, templateName, templateDescription, handleSaveTemplate])

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
      const templateUrl = `${baseUrl}${basePath}/${user?.username}/${slugValue}`
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
        {editor && mode === 'edit' && <ScriptEditor editor={editor} />}
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
            setTemplateDescription(description)
            setTemplateName(name)
          }}
          saveStatus={saveStatus}
        />
      )}
    </div>
  )
}
export default Editor
