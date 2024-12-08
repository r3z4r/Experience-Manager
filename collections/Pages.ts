import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

interface EditableRegion {
  id: string
  selector: string
  content: string
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'editableRegions',
      type: 'array',
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'selector',
          type: 'text',
          required: true,
          admin: {
            description: 'CSS selector to identify this region',
            readOnly: true,
          },
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({}),
        },
      ],
    },
    {
      name: 'htmlContent',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'cssContent',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'gjsData',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Template structure (managed by GrapesJS)',
      },
    },
  ],
  // hooks: {
  //   beforeChange: [
  //     async ({ data, req, operation }) => {
  //       if (operation === 'update' && data.editableRegions) {
  //         return await syncEditableRegionsWithGjs(data)
  //       }
  //       return data
  //     },
  //   ],
  // },
}
