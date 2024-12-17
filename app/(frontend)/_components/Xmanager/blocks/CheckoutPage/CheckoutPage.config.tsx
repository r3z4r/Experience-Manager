import { BlockConfig } from '../types'
import { renderToString } from 'react-dom/server'
import { CheckoutPage } from './CheckoutPage'

export const checkoutCardBlock: BlockConfig = {
  id: 'checkout-card',
  label: 'Checkout Page',
  category: 'Components',
  content: renderToString(<CheckoutPage />),
  attributes: {
    class: 'checkout-card',
  },
}
