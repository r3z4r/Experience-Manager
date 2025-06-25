import type { CollectionConfig } from 'payload'
import { ACCESS_VISIBILITY } from '@/app/(frontend)/_types/template'
import type { User } from '@/payload-types'

export const Flows: CollectionConfig = {
  slug: 'flows',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
    description: 'Visual journeys built with React-Flow',
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Set the creator user for new flows
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

      // Users can read flows they created or have explicit access to
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

      // Users can only update flows they created or have explicit access to
      return {
        or: [{ user: { equals: user.id } }, { 'access.allowedUsers': { contains: user.id } }],
      } as any // Type assertion to bypass complex type checking
    },
    delete: ({ req }) => {
      const user = req.user as User | undefined
      if (!user) return false
      if (user.roles?.includes('admin')) return true

      // Users can only delete flows they created
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ data }) =>
            data?.slug ||
            data?.title
              ?.toLowerCase()
              ?.replace(/[^\w\s-]/g, '')
              ?.replace(/\s+/g, '-')
              ?.replace(/-+/g, '-')
              ?.replace(/^-+|-+$/g, ''),
        ],
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
          defaultValue: ACCESS_VISIBILITY.PRIVATE,
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Approved', value: 'approved' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'graph',
      type: 'json',
      required: true,
      admin: { description: 'Raw React-Flow JSON export' },
    },
    {
      name: 'versionLabel',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional tag for this save',
      },
    },
  ],
}
