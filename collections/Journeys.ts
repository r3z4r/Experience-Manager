import type { CollectionConfig } from 'payload'
import { WizardStepType } from '../lib/types/wizard'
import { slugField } from '../lib/fields/slugField'

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
    slugField('label'),
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
  ],
}

export default Journeys
