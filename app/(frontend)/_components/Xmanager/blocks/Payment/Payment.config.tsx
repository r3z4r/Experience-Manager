import { BlockProperties } from 'grapesjs'
import { PaymentBlock } from './Payment'
import { renderToString } from 'react-dom/server'

export const paymentBlock: BlockProperties = {
  id: 'payment',
  label: 'Payment Form',
  category: 'Payment',
  content: renderToString(<PaymentBlock />),
  attributes: {
    class: 'payment-block',
  },
  media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card"><rect width="22" height="16" x="1" y="4" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="1" y1="14" x2="23" y2="14"/><line x1="1" y1="18" x2="23" y2="18"/></svg>`,
}
