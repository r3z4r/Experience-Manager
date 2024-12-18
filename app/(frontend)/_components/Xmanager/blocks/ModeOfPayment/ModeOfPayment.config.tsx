import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { ModeOfPayment } from './ModeOfPayment'

export const ModeOfPaymentCardBlock: BlockProperties = {
  id: 'modeofpayment-card',
  label: 'ModeOfPayment Card',
  category: 'Components',
  content: renderToString(<ModeOfPayment />),
  attributes: {
    class: 'modeofpayment-card',
  },
}
