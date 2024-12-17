import { BlockConfig } from '../types'
import { renderToString } from 'react-dom/server'
import { ModeOfPayment } from './ModeOfPayment'

export const ModeOfPaymentCardBlock: BlockConfig = {
  id: 'modeofpayment-card',
  label: 'ModeOfPayment Card',
  category: 'Components',
  content: renderToString(<ModeOfPayment/>),
  attributes: {
    class: 'modeofpayment-card',
  },
}
