import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  ACCESS_VISIBILITY,
  COMPONENT_TYPE,
  TEMPLATE_STATUS,
} from '@/app/(frontend)/_types/template'
import { generateSlug } from '@/lib/utils/slug-generator'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data.title) {
          data.slug = await generateSlug(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: Object.entries(TEMPLATE_STATUS).map(([key, value]) => ({
        label: key.charAt(0) + key.slice(1).toLowerCase(),
        value,
      })),
      defaultValue: TEMPLATE_STATUS.DRAFT,
      required: true,
    },
    {
      name: 'access',
      type: 'group',
      fields: [
        {
          name: 'visibility',
          type: 'select',
          options: Object.entries(ACCESS_VISIBILITY).map(([key, value]) => ({
            label: key.charAt(0) + key.slice(1).toLowerCase(),
            value,
          })),
          defaultValue: ACCESS_VISIBILITY.PUBLIC,
          required: true,
        },
        {
          name: 'allowedUsers',
          type: 'relationship',
          relationTo: 'users',
          hasMany: true,
          admin: {
            condition: (data) => data.access?.visibility === 'restricted',
          },
        },
      ],
    },
    {
      name: 'components',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: Object.entries(COMPONENT_TYPE).map(([key, value]) => ({
            label: key
              .split('_')
              .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
              .join(' '),
            value,
          })),
        },
        {
          name: 'config',
          type: 'json',
          admin: {
            description: 'Component-specific configuration',
          },
        },
        {
          name: 'placement',
          type: 'text',
          admin: {
            description: 'CSS selector for component placement',
          },
        },
      ],
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
