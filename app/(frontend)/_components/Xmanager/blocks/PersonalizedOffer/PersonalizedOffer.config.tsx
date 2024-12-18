import { BlockProperties } from 'grapesjs'
import { PersonalizedOffer } from './PersonalizedOffer'
import { renderToString } from 'react-dom/server'

export const personalizedOfferBlock: BlockProperties = {
  id: 'personalized-offer',
  label: 'Personalized Offer',
  category: 'Components',
  content: renderToString(<PersonalizedOffer />),
  attributes: {
    class: 'personalizedOffer',
  },
}
