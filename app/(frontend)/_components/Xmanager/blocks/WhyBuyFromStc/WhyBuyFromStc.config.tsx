import { BlockProperties } from 'grapesjs'
import { WhyBuyFromStc } from './WhyBuyFromStc'
import { renderToString } from 'react-dom/server'

export const WhyBuyFromStcBlock: BlockProperties = {
  id: 'why-buy-from-stc',
  label: 'Why Buy From STC',
  category: 'Components',
  content: renderToString(<WhyBuyFromStc />),
  attributes: {
    class: 'whyBuyFromStc-card',
  },
}
