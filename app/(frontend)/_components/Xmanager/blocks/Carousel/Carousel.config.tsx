import { BlockConfig } from '../types'
import { Carousel } from './Carousel'
import { renderToString } from 'react-dom/server'

const defaultItems = [
  {
    imageUrl: '/xpm/images/service1.jpg',
    title: 'Online Consultation',
    description: 'Connect with healthcare professionals remotely',
  },
  {
    imageUrl: '/xpm/images/service2.jpg',
    title: 'Lab Tests',
    description: 'Book lab tests and health checkups',
  },
  {
    imageUrl: '/xpm/images/service3.jpg',
    title: 'Medicine Delivery',
    description: 'Get medicines delivered to your doorstep',
  },
]

export const carouselBlock: BlockConfig = {
  id: 'carousel',
  label: 'Service Carousel',
  category: 'Components',
  content: renderToString(<Carousel items={defaultItems} />),
  attributes: {
    class: 'carousel-section',
  },
}
