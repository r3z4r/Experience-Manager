import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { MerchandiseCard } from './MerchandiseCard'

const defaultMerchData = {
  title: 'Official Club Home Jersey 2024',
  image: '/images/club-jersey.jpg',
  price: '€89.99',
  description: 'Authentic team jersey with moisture-wicking technology',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
}

export const merchandiseCardBlock: BlockProperties = {
  id: 'merchandise-card',
  label: 'Club Merchandise',
  category: 'Components',
  content: renderToString(<MerchandiseCard {...defaultMerchData} />),
  attributes: {
    class: 'fa fa-tshirt',
  },
}
