import { BlockConfig } from '../types'
import { PaymentBlock } from './Payment'
import { renderToString } from 'react-dom/server'

export const paymentBlock: BlockConfig = {
  id: 'payment',
  label: 'Payment Form',
  category: 'Payment',
  content: renderToString(<PaymentBlock />),
  attributes: {
    class: 'payment-block',
  },
}
