import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      // required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'htmlContent',
      type: 'textarea',
    },
    {
      name: 'cssContent',
      type: 'textarea',
    },
    {
      name: 'gjsData',
      type: 'json',
    },
  ],
}
