import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { PaymentBlock } from './Payment'

export const paymentBlock: BlockProperties = {
  id: 'payment',
  label: 'Payment Form',
  category: 'Sections',
  content: renderToString(<PaymentBlock />),
  attributes: {
    class: 'fa fa-credit-card',
  },
}
