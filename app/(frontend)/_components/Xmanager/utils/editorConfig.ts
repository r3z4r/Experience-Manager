import webpage from 'grapesjs-preset-webpage'
import basicBlocks from 'grapesjs-blocks-basic'
import flexbox from 'grapesjs-blocks-flexbox'
import forms from 'grapesjs-plugin-forms'
import styleFilter from 'grapesjs-style-filter'
import { Editor as GrapesEditor, ProjectData } from 'grapesjs'
import { createTemplate, updateTemplate } from '@/app/(frontend)/_actions/templates'
import { getAssetManagerConfig } from './assetConfig'
import { PayloadImage } from '@/app/(frontend)/_actions/images'

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
            const templateData = {
              title: templateName,
              description: templateDescription,
              htmlContent: editor?.getHtml() || '',
              cssContent: editor?.getCss() || '',
              gjsData: data as ProjectData,
            }

            if (templateId) {
              await updateTemplate(templateId, templateData)
            } else {
              const newTemplate = await createTemplate(templateData)
              if (newTemplate?.id) {
                onTemplateCreated(newTemplate.id)
              }
            }

            onSave(false)
            return true
          } catch (error) {
            console.error('Error saving template:', error)
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
            name: 'Content Align',
            property: 'align-content',
            type: 'select',
            defaults: 'stretch',
            options: [
              { value: 'flex-start', name: 'Start' },
              { value: 'flex-end', name: 'End' },
              { value: 'center', name: 'Center' },
              { value: 'space-between', name: 'Space Between' },
              { value: 'space-around', name: 'Space Around' },
              { value: 'stretch', name: 'Stretch' },
            ],
          },
          {
            name: 'Gap',
            property: 'gap',
            type: 'composite',
            properties: [
              { name: 'Row Gap', property: 'row-gap' },
              { name: 'Column Gap', property: 'column-gap' },
            ],
          },
        ],
      },
    ],
  },
})
