import { BlockConfig } from '../types'
import { OrderSummary } from './OrderSummary'
import { renderToString } from 'react-dom/server'

export const OrderSummaryCardBlock: BlockConfig = {
  id: 'ordersummary-card',
  label: 'Order Summary',
  category: 'Components',
  content: renderToString(<OrderSummary />),
  attributes: {
    class: 'ordersummary-card',
  },
}
