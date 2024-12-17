import { BlockConfig } from '../types'
import { WhyBuyFromStc } from './WhyBuyFromStc'
import { renderToString } from 'react-dom/server'

export const WhyBuyFromStcBlock: BlockConfig = {
  id: 'whyBuyFromStc-card',
  label: 'WhyBuyFromStc Card',
  category: 'Components',
  content: renderToString(<WhyBuyFromStc />),
  attributes: {
    class: 'whyBuyFromStc-card',
  },
}
