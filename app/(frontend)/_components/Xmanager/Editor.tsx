'use client'

import { useEffect, useRef, useState } from 'react'
import grapesjs, { Editor as GrapesEditor } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import './Editor.globals.css'
import styles from './Editor.module.css'
import webpage from 'grapesjs-preset-webpage'
import basicBlocks from 'grapesjs-blocks-basic'
import flexbox from 'grapesjs-blocks-flexbox'
import forms from 'grapesjs-plugin-forms'
import styleFilter from 'grapesjs-style-filter'
import { templateBlocks, commonStyles } from './default-template'
import { SaveIcon, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  fetchTemplateById,
  updateTemplate,
  createTemplate,
} from '@/app/(frontend)/_actions/templates'
import { toast } from 'sonner'

interface EditorProps {
  templateId?: string
  mode?: 'edit' | 'view'
  onSave?: () => void // Callback to refresh template list
}

const Editor = ({ templateId, mode = 'edit', onSave }: EditorProps) => {
  const router = useRouter()
  const editorRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<GrapesEditor | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (!editorRef.current) return

    const editorConfig = {
      container: editorRef.current,
      fromElement: true,
      height: '93vh',
      width: '100%',
      storageManager: {
        type: 'remote',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 20,
        contentTypeJson: true,
        options: {
          remote: {
            headers: {
              'Content-Type': 'application/json',
            },
            onLoad: async () => {
              if (!templateId) {
                return {
                  components: [],
                  styles: [],
                  html: '',
                  css: '',
                }
              }

              try {
                const template = await fetchTemplateById(templateId)
                if (!template) {
                  toast.error('Template not found')
                  return {
                    components: [],
                    styles: [],
                    html: '',
                    css: '',
                  }
                }

                setTemplateName(template.title || '')
                setTemplateDescription(template.description || '')

                return {
                  components: template.gjsData?.components || [],
                  styles: template.gjsData?.styles || [],
                  html: template.htmlContent || '',
                  css: template.cssContent || '',
                }
              } catch (error) {
                console.error('Error loading template:', error)
                toast.error('Failed to load template')
                return {
                  components: [],
                  styles: [],
                  html: '',
                  css: '',
                }
              }
            },
            onStore: async (data: unknown) => {
              try {
                const templateData = {
                  title: templateName,
                  description: templateDescription,
                  htmlContent: editor.getHtml(),
                  cssContent: editor.getCss(),
                  gjsData: {
                    components: editor.getComponents(),
                    styles: editor.getStyle(),
                  },
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
          blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video'],
          flexGrid: true,
        },
        [flexbox]: {
          flexboxBlock: {
            label: 'Flexbox',
            category: 'Layout',
          },
        },
        [forms]: {
          blocks: ['form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox'],
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
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'Dimension',
            open: false,
            properties: [
              'width',
              'height',
              'min-width',
              'min-height',
              'max-width',
              'max-height',
              'padding',
              'margin',
              'position',
              'top',
              'right',
              'bottom',
              'left',
            ],
          },
          {
            name: 'Typography',
            open: false,
            properties: [
              'font-family',
              'font-size',
              'font-weight',
              'letter-spacing',
              'color',
              'line-height',
              'text-align',
              'text-decoration',
              'text-shadow',
              'text-transform',
            ],
          },
          {
            name: 'Decorations',
            open: false,
            properties: [
              'background-color',
              'border',
              'border-radius',
              'box-shadow',
              'background',
              'opacity',
            ],
          },
          {
            name: 'Flex',
            open: false,
            properties: [
              {
                name: 'Flex Container',
                property: 'display',
                type: 'select',
                defaults: 'block',
                options: [
                  { value: 'block', name: 'Block' },
                  { value: 'flex', name: 'Flex' },
                  { value: 'inline-flex', name: 'Inline Flex' },
                ],
              },
              'flex-direction',
              'flex-wrap',
              'justify-content',
              'align-items',
              'align-content',
              'gap',
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
            properties: [
              'transition',
              'transform',
              'cursor',
              'overflow',
              'z-index',
              'display',
              'visibility',
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
            widthMedia: '992px',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '480px',
          },
        ],
      },
      blockManager: {
        blocks: templateBlocks.map((block) => ({
          label: block.label,
          category: block.category,
          content: `<div data-gjs-type="flex-container">${block.content}</div>`,
          style: block.css,
        })),
      },
      containerScroll: true,
      customClass: styles.customGjsEditor,
    }

    const editor = grapesjs.init(editorConfig)

    const panelTop = document.querySelector('.panel__top')
    if (!panelTop) {
      const newPanel = document.createElement('div')
      newPanel.className = 'panel__top'
      editorRef.current.insertBefore(newPanel, editorRef.current.firstChild)
    }

    editor.Commands.add('save-template', {
      run: () => setShowSaveDialog(true),
    })

    editor.on('load', () => {
      const panelManager = editor.Panels
      panelManager.addPanel({
        id: 'custom-panel',
        el: '.panel__top',
        className: 'custom-panel-top',
      })
    })

    editor.Panels.addPanel({
      id: 'panel-styles',
      visible: true,
      buttons: [],
      content: `
        <div class="styles-container" style="height: 100%;">
          <div class="gjs-one-bg gjs-two-color" style="padding: 10px;">
            <div class="gjs-sm-sectors"></div>
          </div>
        </div>
      `,
    })

    setEditor(editor)

    return () => editor.destroy()
  }, [templateId, templateName, templateDescription, router])

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

  const handleSaveTemplate = async () => {
    if (!editor) return
    if (!templateName.trim()) {
      toast.error('Please enter a template name')
      return
    }

    setSaveStatus('saving')

    try {
      const pageData = {
        title: templateName,
        description: templateDescription,
        htmlContent: editor.getHtml(),
        cssContent: editor.getCss(),
        gjsData: editor.getProjectData(),
      }

      const savedTemplate = templateId
        ? await updateTemplate(templateId, pageData)
        : await createTemplate(pageData)

      if (savedTemplate?.id) {
        setHasUnsavedChanges(false)
        setSaveStatus('saved')
        setShowSaveDialog(false)
        onSave?.()

        if (!templateId) {
          router.push(`/editor/${savedTemplate.id}`)
        }

        toast.success(
          templateId ? 'Template updated successfully' : 'New template created successfully',
        )

        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch (error) {
      console.error('Error saving template:', error)
      setSaveStatus('error')
      toast.error('Failed to save template')
    }
  }

  return (
    <>
      <div className={styles.editorWrapper}>
        <div className={`${styles.panelTop} panel__top custom-panel-top`}>
          <div className={styles.panelBasicActions}>
            <button onClick={() => router.push('/template-list')} className={styles.backButton}>
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </button>
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
