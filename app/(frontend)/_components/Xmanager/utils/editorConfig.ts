import webpage from 'grapesjs-preset-webpage'
import basicBlocks from 'grapesjs-blocks-basic'
import flexbox from 'grapesjs-blocks-flexbox'
import forms from 'grapesjs-plugin-forms'
import styleFilter from 'grapesjs-style-filter'
import { Editor as GrapesEditor, ProjectData } from 'grapesjs'
import { createTemplate, updateTemplate } from '@/app/(frontend)/_actions/templates'
import { getAssetManagerConfig } from './assetConfig'
import { PayloadImage } from '@/app/(frontend)/_actions/images'
import { TemplateData } from '@/app/(frontend)/_types/template-data'

export const getEditorConfig = (
  container: HTMLElement,
  editor: GrapesEditor | null,
  templateName: string,
  templateDescription: string,
  templateId: string | undefined,
  onSave: (hasChanges: boolean) => void,
  onTemplateCreated: (newTemplateId: string) => void,
  images: PayloadImage[] = [],
) => ({
  container,
  fromElement: true,
  height: '93vh',
  width: '100%',
  assetManager: {
    ...getAssetManagerConfig(images),
    onSelect: (asset: PayloadImage) => {
      console.log('Selected asset:', asset)
    },
    onError: (err: Error) => {
      console.error('Asset manager error:', err)
    },
  },
  storageManager: {
    type: 'remote',
    autosave: true,
    autoload: false,
    stepsBeforeSave: 2,
    options: {
      remote: {
        onStore: async (data: unknown) => {
          try {
            if (!templateId) {
              console.warn('No template ID available for auto-save')
              return false
            }
            await updateTemplate(templateId, {
              gjsData: data as ProjectData,
            })
            console.log('Template updated successfully')
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
  plugins: [webpage, basicBlocks, flexbox, forms, styleFilter],
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
            presets: [
              { name: 'Primary', value: 'hsl(var(--primary))' },
              { name: 'Secondary', value: 'hsl(var(--secondary))' },
              { name: 'Accent', value: 'hsl(var(--accent))' },
              { name: 'Background', value: 'hsl(var(--background))' },
              { name: 'Foreground', value: 'hsl(var(--foreground))' },
            ],
          },
          {
            type: 'color',
            name: 'Text Color',
            property: 'color',
            defaults: 'black',
            presets: [
              { name: 'Primary', value: 'hsl(var(--primary))' },
              { name: 'Secondary', value: 'hsl(var(--secondary))' },
              { name: 'Accent', value: 'hsl(var(--accent))' },
              { name: 'Background', value: 'hsl(var(--background))' },
              { name: 'Foreground', value: 'hsl(var(--foreground))' },
            ],
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
              { value: '12px', name: 'Small' },
              { value: '16px', name: 'Normal' },
              { value: '20px', name: 'Large' },
              { value: '24px', name: 'Extra Large' },
            ],
          },
          {
            name: 'Font Weight',
            property: 'font-weight',
            type: 'select',
            defaults: 'normal',
            options: [
              { value: 'normal', name: 'Normal' },
              { value: 'bold', name: 'Bold' },
              { value: 'lighter', name: 'Light' },
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
              { value: '0', name: 'None' },
              { value: '0.5rem', name: 'Small' },
              { value: '1rem', name: 'Medium' },
              { value: '2rem', name: 'Large' },
            ],
          },
          {
            name: 'Padding Size',
            property: 'padding',
            type: 'select',
            defaults: '0',
            options: [
              { value: '0', name: 'None' },
              { value: '0.5rem', name: 'Small' },
              { value: '1rem', name: 'Medium' },
              { value: '2rem', name: 'Large' },
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
              { value: 'none', name: 'None' },
              { value: 'var(--shadow-sm)', name: 'Small' },
              { value: 'var(--shadow-md)', name: 'Medium' },
              { value: 'var(--shadow-lg)', name: 'Large' },
            ],
          },
          {
            type: 'select',
            name: 'Border Radius',
            property: 'border-radius',
            defaults: '0',
            options: [
              { value: '0', name: 'None' },
              { value: 'var(--radius-sm)', name: 'Small' },
              { value: 'var(--radius-md)', name: 'Medium' },
              { value: 'var(--radius-lg)', name: 'Large' },
              { value: '9999px', name: 'Round' },
            ],
          },
        ],
      },
    ],
  },
})
