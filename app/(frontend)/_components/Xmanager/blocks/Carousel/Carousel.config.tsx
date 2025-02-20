'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { Carousel } from './Carousel'

export async function getCarouselBlock() {
  const defaultItems = [
    {
      imageUrl: '/xpm/images/service1.jpg',
      title: 'Online Consultation',
      description: 'Connect with professionals remotely',
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

  return await createBlockConfig({
    id: 'carousel',
    label: 'Service Carousel',
    category: 'Components',
    component: <Carousel items={defaultItems} />,
    attributes: {
      class: 'carousel-section',
    },
  })
}
