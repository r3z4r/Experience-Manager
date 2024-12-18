import { BlockProperties } from 'grapesjs'
import { Subscription } from './Subscription'
import { renderToString } from 'react-dom/server'

export const subscriptionBlock: BlockProperties = {
  id: 'subscription',
  label: 'Subscription Plan',
  category: 'Components',
  content: renderToString(<Subscription />),
  attributes: {
    class: 'subscription-section',
  },
}
