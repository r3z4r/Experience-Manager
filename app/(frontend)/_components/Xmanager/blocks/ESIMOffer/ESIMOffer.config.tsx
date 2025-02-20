'use server'

import { createBlockConfig } from '../../utils/serverUtils'
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

export async function getEsimOfferBlock() {
  return await createBlockConfig({
    id: 'esim-offer',
    label: 'eSIM Offer',
    category: 'Components',
    component: <ESIMOffer plans={defaultPlans} />,
    attributes: {
      class: 'fa fa-sim-card',
    },
  })
}
