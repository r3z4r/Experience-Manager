import { renderToString } from 'react-dom/server'
import { CheckoutPage } from './CheckoutPage'
import { BlockProperties } from 'grapesjs'

export const checkoutCardBlock: BlockProperties = {
  id: 'checkout-card',
  label: 'Checkout Page',
  category: 'Components',
  content: renderToString(<CheckoutPage />),
  attributes: {
    class: 'checkout-card',
  },
}
