import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { CheckoutSteps } from './CheckoutSteps'

const footballCheckoutSteps = {
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

export const checkoutStepsBlock: BlockProperties = {
  id: 'checkout-steps',
  label: 'Checkout Steps',
  category: 'Sections',
  content: renderToString(<CheckoutSteps {...footballCheckoutSteps} />),
  attributes: {
    class: 'fa fa-list-ol',
  },
}
