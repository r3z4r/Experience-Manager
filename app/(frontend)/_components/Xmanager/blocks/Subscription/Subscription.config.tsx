import { BlockConfig } from '../types'
import { Subscription } from './Subscription'
import { renderToString } from 'react-dom/server'

export const subscriptionBlock: BlockConfig = {
  id: 'subscription',
  label: 'Subscription Plan',
  category: 'Components',
  content: renderToString(<Subscription />),
  attributes: {
    class: 'subscription-section',
  },
}
