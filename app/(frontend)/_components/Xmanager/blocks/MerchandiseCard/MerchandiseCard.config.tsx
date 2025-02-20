'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { MerchandiseCard } from './MerchandiseCard'

const defaultMerchData = {
  title: 'Official Club Home Jersey 2024',
  image: '/images/club-jersey.jpg',
  price: '€89.99',
  description: 'Authentic team jersey with moisture-wicking technology',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
}

export async function getMerchandiseCardBlock() {
  return await createBlockConfig({
    id: 'merchandise-card',
    label: 'Merchandise Card',
    category: 'Components',
    component: <MerchandiseCard {...defaultMerchData} />,
    attributes: {
      class: 'fa fa-shopping-bag',
    },
  })
}
