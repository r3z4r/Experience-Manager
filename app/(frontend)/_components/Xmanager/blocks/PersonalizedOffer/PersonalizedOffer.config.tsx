'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { PersonalizedOffer } from './PersonalizedOffer'

export async function getPersonalizedOfferBlock() {
  return await createBlockConfig({
    id: 'personalized-offer',
    label: 'Personalized Offer',
    category: 'Components',
    component: <PersonalizedOffer />,
    attributes: {
      class: 'fa fa-gift',
    },
  })
}
