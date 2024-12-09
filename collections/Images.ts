import type { CollectionConfig } from 'payload'

export const Images: CollectionConfig = {
  slug: 'images',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  upload: {
    // staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 450,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Hero Images', value: 'hero' },
        { label: 'Doctor Images', value: 'doctors' },
        { label: 'Service Images', value: 'services' },
        { label: 'Logos', value: 'logos' },
      ],
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'width',
      type: 'number',
      required: true,
      defaultValue: 250,
    },
    {
      name: 'height',
      type: 'number',
      required: true,
      defaultValue: 350,
    },
  ],
}
