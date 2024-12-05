import { BlockConfig } from '../types'
import { ServiceCard } from './ServiceCard'
import { renderToString } from 'react-dom/server'

export const serviceCardBlock: BlockConfig = {
  id: 'service-card',
  label: 'Service Card',
  category: 'Components',
  content: renderToString(<ServiceCard />),
  attributes: {
    class: 'service-card',
  },
}
