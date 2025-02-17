import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { ESIMOffer } from './ESIMOffer'

const defaultPlans = [
  {
    id: '1',
    name: 'Global Traveler',
    data: '10GB',
    validity: '30 days',
    coverage: ['Europe', 'Americas', 'Asia'],
    originalPrice: '$49.99',
    discountedPrice: '$39.99',
  },
  {
    id: '2',
    name: 'Business Pro',
    data: '20GB',
    validity: '30 days',
    coverage: ['Worldwide'],
    originalPrice: '$79.99',
    discountedPrice: '$59.99',
  },
]

export const esimOfferBlock: BlockProperties = {
  id: 'esim-offer',
  label: 'eSIM Offer',
  category: 'Sections',
  content: renderToString(
    <ESIMOffer plans={defaultPlans} onSelect={() => {}} onDecline={() => {}} />,
  ),
  attributes: {
    class: 'fa fa-sim-card',
  },
}
