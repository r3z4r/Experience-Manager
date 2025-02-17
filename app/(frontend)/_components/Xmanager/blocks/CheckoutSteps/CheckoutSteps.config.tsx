import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { CheckoutSteps } from './CheckoutSteps'

const defaultCheckoutData = {
  steps: [
    {
      title: 'Plan Selection',
      description: 'Choose your eSIM data plan',
      isActive: true,
      isCompleted: false,
    },
    {
      title: 'Personal Information',
      description: 'Enter your contact details',
      isActive: false,
      isCompleted: false,
    },
    {
      title: 'Payment',
      description: 'Complete your purchase',
      isActive: false,
      isCompleted: false,
    },
  ],
  currentStep: 1,
}

export const checkoutStepsBlock: BlockProperties = {
  id: 'checkout-steps',
  label: 'Checkout Steps',
  category: 'Sections',
  content: renderToString(<CheckoutSteps {...defaultCheckoutData} />),
  attributes: {
    class: 'fa fa-list-ol',
  },
}
