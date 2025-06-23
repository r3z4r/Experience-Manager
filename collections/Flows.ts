import type { CollectionConfig } from 'payload'

const Flows: CollectionConfig = {
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

  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
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

export default Flows
