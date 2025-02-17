import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { ApplicationConfirmation } from './ApplicationConfirmation'

const defaultConfirmationData = {
  cardApproved: true,
  selectedPlan: {
    name: 'Global Traveler',
    data: '10GB',
    price: '$39.99',
  },
}

export const applicationConfirmationBlock: BlockProperties = {
  id: 'application-confirmation',
  label: 'Application Confirmation',
  category: 'Sections',
  content: renderToString(<ApplicationConfirmation {...defaultConfirmationData} />),
  attributes: {
    class: 'fa fa-check-circle',
  },
}
