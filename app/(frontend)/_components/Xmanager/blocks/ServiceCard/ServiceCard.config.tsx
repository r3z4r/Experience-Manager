import { BlockProperties } from 'grapesjs'
import { ServiceCard } from './ServiceCard'
import { renderToString } from 'react-dom/server'

export const serviceCardBlock: BlockProperties = {
  id: 'service-card',
  label: 'Service Card',
  category: 'Components',
  content: renderToString(<ServiceCard />),
  attributes: {
    class: 'service-card',
  },
}
