import type { Field, Validate } from 'payload'

/**
 * Creates a slug field that automatically generates a URL-friendly slug from another field
 * @param {string} fieldToUse - The field to base the slug on (usually 'title' or 'label')
 * @returns {Field} - A configured slug field for Payload CMS
 */
export const slugField = (fieldToUse: string): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Slug',
  admin: {
    position: 'sidebar',
    description: 'URL-friendly identifier (auto-generated if left blank)',
  },
  hooks: {
    beforeValidate: [
      async ({ value, data, operation }) => {
        // If creating a new item and no slug provided, generate from the specified field
        if (operation === 'create' && !value && data?.[fieldToUse]) {
          return generateSlug(data[fieldToUse])
        }

        // If updating and slug is provided but empty, generate from the specified field
        if (operation === 'update' && value === '' && data?.[fieldToUse]) {
          return generateSlug(data[fieldToUse])
        }

        // If slug is provided, ensure it's properly formatted
        if (value) {
          return generateSlug(value)
        }

        return value
      },
    ],
    // We can't do duplicate checking in the validate function
    // so we'll handle basic validation only
  },
  // Simple validation that doesn't require payload access
  validate: ((value, { required }) => {
    if (!value && !required) return true

    // Basic format validation
    if (typeof value === 'string') {
      // Check if slug contains only allowed characters
      const validSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      if (!validSlugRegex.test(value)) {
        return 'Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.'
      }
      return true
    }
    
    return 'Slug must be a string'
  }) as Validate,
})

/**
 * Generates a URL-friendly slug from a string
 * @param {string} input - The string to convert to a slug
 * @returns {string} - A URL-friendly slug
 */
const generateSlug = (input: string): string => {
  if (!input) return ''

  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}
