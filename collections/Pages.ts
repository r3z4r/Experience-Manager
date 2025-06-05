import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  ACCESS_VISIBILITY,
  COMPONENT_TYPE,
  TEMPLATE_STATUS,
} from '@/app/(frontend)/_types/template'
import { generateSlug } from '@/lib/utils/slug-generator'

import type { User } from '@/payload-types'

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

        // Set the creator user for new pages
        if (operation === 'create' && req.user) {
          data.user = req.user.id

          // Also add the creator to allowedUsers if visibility is restricted
          if (
            data.access?.visibility === 'restricted' &&
            !data.access.allowedUsers?.includes(req.user.id)
          ) {
            data.access.allowedUsers = [...(data.access.allowedUsers || []), req.user.id]
          }
        }

        return data
      },
    ],
  },
  access: {
    read: ({ req }) => {
      const user = req.user as User | undefined
      if (!user) return false
      if (user.roles?.includes('admin')) return true

      // Users can read pages they created or have explicit access to
      // Using a more compatible query format for PayloadCMS
      return {
        or: [
          { user: { equals: user.id } },
          { 'access.visibility': { equals: 'public' } },
          { 'access.allowedUsers': { contains: user.id } },
        ],
      } as any // Type assertion to bypass complex type checking
    },
    update: ({ req }) => {
      const user = req.user as User | undefined
      if (!user) return false
      if (user.roles?.includes('admin')) return true

      // Users can only update pages they created or have explicit access to
      return {
        or: [{ user: { equals: user.id } }, { 'access.allowedUsers': { contains: user.id } }],
      } as any // Type assertion to bypass complex type checking
    },
    delete: ({ req }) => {
      const user = req.user as User | undefined
      if (!user) return false
      if (user.roles?.includes('admin')) return true

      // Users can only delete pages they created
      return { user: { equals: user.id } } as any
    },
    create: ({ req }) => {
      const user = req.user as User | undefined
      return !!user
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The user who created this page',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
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
      name: 'jsContent',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'JavaScript code for the template',
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
