import { BlockConfig } from '../types'
import { PersonalizedOffer } from './PersonalizedOffer'
import { renderToString } from 'react-dom/server'

export const personalizedOfferBlock: BlockConfig = {
  id: 'personalizedOffer',
  label: 'PersonalizedOffer Banner',
  category: 'Components',
  content: renderToString(<PersonalizedOffer />),
  attributes: {
    class: 'personalizedOffer',
  },
}
