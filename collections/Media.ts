import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    description: 'Upload and manage images for your website',
  },
  access: {
    read: () => true,
    create: () => true, // Allow uploads from admin panel
    update: () => true,
    delete: () => true,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
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
    formatOptions: {
      format: 'webp',
      options: {
        quality: 85,
      },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Hero Images', value: 'hero' },
        { label: 'Doctor Images', value: 'doctors' },
        { label: 'Service Images', value: 'services' },
        { label: 'Logos', value: 'logos' },
      ],
    },
  ],
}
