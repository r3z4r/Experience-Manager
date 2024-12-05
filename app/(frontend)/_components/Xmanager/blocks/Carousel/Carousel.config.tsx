import { BlockConfig } from '../types'
import { Carousel } from './Carousel'
import { renderToString } from 'react-dom/server'

export const carouselBlock: BlockConfig = {
  id: 'carousel',
  label: 'Service Carousel',
  category: 'Components',
  content: renderToString(<Carousel />),
  attributes: {
    class: 'carousel-section',
  },
}
