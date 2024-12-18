import { BlockProperties } from 'grapesjs'
import { TechnicalSpecsCard } from './TechnicalSpecsCard'
import { renderToString } from 'react-dom/server'

export const technicalSpecsCardBlock: BlockProperties = {
  id: 'technical-specs-card',
  label: 'Technical Specs Card',
  category: 'Components',
  content: renderToString(<TechnicalSpecsCard />),
  attributes: {
    class: 'technicalSpecs-card',
  },
}
