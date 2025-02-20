'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { CheckoutSteps } from './CheckoutSteps'

export async function getCheckoutStepsBlock() {
  const defaultCheckoutSteps = {
    steps: [
      {
        title: 'eSIM Selection',
        description: 'Choose your match day connectivity plan',
        isActive: true,
        isCompleted: false,
      },
      {
        title: 'Club Merchandise',
        description: 'Add official team merchandise (optional)',
        isActive: false,
        isCompleted: false,
      },
      {
        title: 'Delivery Details',
        description: 'Where should we send your merchandise?',
        isActive: false,
        isCompleted: false,
      },
      {
        title: 'Payment',
        description: 'Secure payment for your order',
        isActive: false,
        isCompleted: false,
      },
    ],
    currentStep: 1,
  }

  return await createBlockConfig({
    id: 'checkout-steps',
    label: 'Checkout Steps',
    category: 'Sections',
    component: <CheckoutSteps {...defaultCheckoutSteps} />,
    attributes: {
      class: 'fa fa-list-ol',
    },
  })
}
