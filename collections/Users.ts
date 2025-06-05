import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'username',
      label: 'User Name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: 'Enter user name',
      },
    },
    {
      name: 'roles',
      label: 'Roles',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: ['user'],
      admin: {
        description: 'Assign roles to this user',
      },
    },
    // Email field is added by default by Payload when auth: true
  ],
}
