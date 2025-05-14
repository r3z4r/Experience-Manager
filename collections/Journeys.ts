import type { CollectionConfig } from 'payload'
import { WizardStepType } from '../lib/types/wizard'

const Journeys: CollectionConfig = {
  slug: 'journeys',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'updatedAt'],
    description: 'Wizard journeys for guided user experiences',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Journey Name',
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [({ data }) => {
          if (data && data.label && !data.slug) {
            return data.label
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '')
          }
          return data?.slug || ''
        }],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Predefined', value: WizardStepType.Predefined },
            { label: 'Template', value: WizardStepType.Template },
          ],
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'ref',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'localization',
      type: 'group',
      label: 'Localization Options',
      admin: {
        description: 'Configure language and currency options for this journey',
      },
      fields: [
        {
          name: 'showLanguageSelector',
          type: 'checkbox',
          label: 'Show Language Selector',
          defaultValue: false,
        },
        {
          name: 'showCurrencySelector',
          type: 'checkbox',
          label: 'Show Currency Selector',
          defaultValue: false,
        },
        {
          name: 'languages',
          type: 'array',
          label: 'Available Languages',
          admin: {
            description: 'Define the languages available in this journey',
            condition: (data) => data?.localization?.showLanguageSelector === true,
          },
          fields: [
            {
              name: 'code',
              type: 'text',
              label: 'Language Code',
              required: true,
              admin: {
                description: 'ISO language code (e.g., "en", "fr", "es")',
              },
            },
            {
              name: 'name',
              type: 'text',
              label: 'Display Name',
              required: true,
              admin: {
                description: 'Language name (e.g., "English", "Français")',
              },
            },
            {
              name: 'default',
              type: 'checkbox',
              label: 'Default Language',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'currencies',
          type: 'array',
          label: 'Available Currencies',
          admin: {
            description: 'Define the currencies available in this journey',
            condition: (data) => data?.localization?.showCurrencySelector === true,
          },
          fields: [
            {
              name: 'code',
              type: 'text',
              label: 'Currency Code',
              required: true,
              admin: {
                description: 'ISO currency code (e.g., "USD", "EUR", "GBP")',
              },
            },
            {
              name: 'symbol',
              type: 'text',
              label: 'Currency Symbol',
              required: true,
              admin: {
                description: 'Currency symbol (e.g., "$", "€", "£")',
              },
            },
            {
              name: 'name',
              type: 'text',
              label: 'Display Name',
              required: true,
              admin: {
                description: 'Currency name (e.g., "US Dollar", "Euro")',
              },
            },
            {
              name: 'default',
              type: 'checkbox',
              label: 'Default Currency',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}

export default Journeys
