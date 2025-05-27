import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
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
    // Email field is added by default by Payload when auth: true
  ],
}
