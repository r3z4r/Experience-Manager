'use client'

import webpage from 'grapesjs-preset-webpage'
import basicBlocks from 'grapesjs-blocks-basic'
import flexbox from 'grapesjs-blocks-flexbox'
import forms from 'grapesjs-plugin-forms'
import styleFilter from 'grapesjs-style-filter'
import { Editor, Editor as GrapesEditor, ProjectData, BlockProperties } from 'grapesjs'
import { registerFlowKeyTrait } from '@/app/(frontend)/_components/Xmanager/plugins/flowKeyTrait'
import { updateTemplate } from '@/app/(frontend)/_actions/templates'
import { getAssetManagerConfig } from './assetConfig'
import { PayloadImage } from '@/app/(frontend)/_actions/images'
import { EditorConfig } from 'grapesjs'
import { processBlockContent } from './clientUtils'

export const getEditorConfig = (
  container: HTMLElement,
  editor: GrapesEditor | null,
  templateName: string,
  templateDescription: string,
  templateId: string | undefined,
  onSave: (hasChanges: boolean) => void,
  onTemplateCreated: (newTemplateId: string) => void,
  images: PayloadImage[] = [],
  blocks: BlockProperties[] = [],
): EditorConfig => ({
  container,
  fromElement: true,
  height: '89vh',
  width: '100%',
  assetManager: {
    ...getAssetManagerConfig(editor as Editor, images),
    embedAsBase64: false,
    dropzone: true,
    openAssetsOnDrop: true,
    autoAdd: true,
  },
  storageManager: {
    type: 'remote',
    autosave: true,
    autoload: false,
    stepsBeforeSave: 1,
    options: {
      remote: {
        headers: {
          'Content-Type': 'application/json',
        },
        onStore: async (data: ProjectData) => {
          try {
            if (!templateId) {
              console.warn('No template ID available for auto-save')
              return false
            }
            await updateTemplate(templateId, {
              gjsData: data as ProjectData,
            })
            onSave(false)
            return true
          } catch (error) {
            console.error('Error auto-saving template:', error)
            return false
          }
        },
      },
    },
  },
  plugins: [
    webpage,
    basicBlocks,
    flexbox,
    forms,
    styleFilter,
    // Registers custom trait for data-flow-key
    (ed: Editor) => {
      registerFlowKeyTrait(ed)
    },
  ],
  pluginsOpts: {
    'grapesjs-preset-webpage': {
      blocks: ['link-block', 'quote', 'text-basic'],
      modalImportButton: true,
      modalImportLabel: 'Import',
      modalImportContent: '',
    },
    'grapesjs-blocks-basic': {
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
    'grapesjs-blocks-flexbox': {
      flexboxBlock: {
        label: 'Flexbox Container',
        category: 'Layout',
        attributes: { class: 'flex-container' },
        content: `
          <div class="flex-container" data-gjs-droppable="true" data-gjs-custom-name="Flex Container">
            <div class="flex-item" data-gjs-draggable="true" data-gjs-custom-name="Flex Item">Item 1</div>
            <div class="flex-item" data-gjs-draggable="true" data-gjs-custom-name="Flex Item">Item 2</div>
            <div class="flex-item" data-gjs-draggable="true" data-gjs-custom-name="Flex Item">Item 3</div>
          </div>
        `,
      },
    },
    'grapesjs-plugin-forms': {
      blocks: ['form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio'],
    },
    'grapesjs-style-filter': {
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
        name: 'General',
        open: false,
        buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
      },
      {
        name: 'Layout',
        open: false,
        buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
      },
      {
        name: 'Colors',
        open: false,
        properties: [
          {
            type: 'color',
            name: 'Background',
            property: 'background-color',
            defaults: 'none',
            // presets: [
            //   { id: 'primary', name: 'Primary', value: 'hsl(var(--primary))' },
            //   { id: 'secondary', name: 'Secondary', value: 'hsl(var(--secondary))' },
            //   { id: 'accent', name: 'Accent', value: 'hsl(var(--accent))' },
            //   { id: 'background', name: 'Background', value: 'hsl(var(--background))' },
            //   { id: 'foreground', name: 'Foreground', value: 'hsl(var(--foreground))' },
            // ],
          },
          {
            type: 'color',
            name: 'Text Color',
            property: 'color',
            defaults: 'black',
            // presets: [
            //   { id: 'primary', name: 'Primary', value: 'hsl(var(--primary))' },
            //   { id: 'secondary', name: 'Secondary', value: 'hsl(var(--secondary))' },
            //   { id: 'accent', name: 'Accent', value: 'hsl(var(--accent))' },
            //   { id: 'background', name: 'Background', value: 'hsl(var(--background))' },
            //   { id: 'foreground', name: 'Foreground', value: 'hsl(var(--foreground))' },
            // ],
          },
        ],
      },
      {
        name: 'Typography',
        open: false,
        properties: [
          {
            name: 'Font Size',
            property: 'font-size',
            type: 'select',
            defaults: '16px',
            options: [
              { id: '12px', value: '12px', name: 'Small' },
              { id: '16px', value: '16px', name: 'Normal' },
              { id: '20px', value: '20px', name: 'Large' },
              { id: '24px', value: '24px', name: 'Extra Large' },
            ],
          },
          {
            name: 'Font Weight',
            property: 'font-weight',
            type: 'select',
            defaults: 'normal',
            options: [
              { id: 'normal', value: 'normal', name: 'Normal' },
              { id: 'bold', value: 'bold', name: 'Bold' },
              { id: 'lighter', value: 'lighter', name: 'Light' },
            ],
          },
          'text-align',
          'line-height',
          'letter-spacing',
          'text-decoration',
        ],
      },
      {
        name: 'Spacing',
        open: false,
        properties: [
          {
            name: 'Spacing Size',
            property: 'margin',
            type: 'select',
            defaults: '0',
            options: [
              { id: '0', value: '0', name: 'None' },
              { id: '0.5rem', value: '0.5rem', name: 'Small' },
              { id: '1rem', value: '1rem', name: 'Medium' },
              { id: '2rem', value: '2rem', name: 'Large' },
            ],
          },
          {
            name: 'Padding Size',
            property: 'padding',
            type: 'select',
            defaults: '0',
            options: [
              { id: '0', value: '0', name: 'None' },
              { id: '0.5rem', value: '0.5rem', name: 'Small' },
              { id: '1rem', value: '1rem', name: 'Medium' },
              { id: '2rem', value: '2rem', name: 'Large' },
            ],
          },
        ],
      },
      {
        name: 'Effects',
        open: false,
        properties: [
          {
            type: 'select',
            name: 'Shadow',
            property: 'box-shadow',
            defaults: 'none',
            options: [
              { id: 'none', value: 'none', name: 'None' },
              { id: 'var(--shadow-sm)', value: 'var(--shadow-sm)', name: 'Small' },
              { id: 'var(--shadow-md)', value: 'var(--shadow-md)', name: 'Medium' },
              { id: 'var(--shadow-lg)', value: 'var(--shadow-lg)', name: 'Large' },
            ],
          },
          {
            type: 'select',
            name: 'Border Radius',
            property: 'border-radius',
            defaults: '0',
            options: [
              { id: '0', value: '0', name: 'None' },
              { id: 'var(--radius-sm)', value: 'var(--radius-sm)', name: 'Small' },
              { id: 'var(--radius-md)', value: 'var(--radius-md)', name: 'Medium' },
              { id: 'var(--radius-lg)', value: 'var(--radius-lg)', name: 'Large' },
              { id: '9999px', value: '9999px', name: 'Round' },
            ],
          },
        ],
      },
    ],
  },

  blockManager: {
    blocks: blocks.map((block) => processBlockContent(block)),
  },
})
