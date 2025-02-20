'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { ApplicationConfirmation } from './ApplicationConfirmation'

export async function getApplicationConfirmationBlock() {
  const defaultConfirmationData = {
    cardApproved: true,
    selectedPlan: {
      name: 'Global Traveler',
      data: '10GB',
      price: '30 days',
    },
  }

  return await createBlockConfig({
    id: 'application-confirmation',
    label: 'Application Confirmation',
    category: 'Sections',
    component: <ApplicationConfirmation {...defaultConfirmationData} />,
    attributes: {
      class: 'fa fa-check-circle',
    },
  })
}
