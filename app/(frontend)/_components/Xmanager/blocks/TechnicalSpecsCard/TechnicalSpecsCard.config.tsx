import { BlockConfig } from '../types'
import { TechnicalSpecsCard } from './TechnicalSpecsCard'
import { renderToString } from 'react-dom/server'

export const technicalSpecsCardBlock: BlockConfig = {
  id: 'technicalSpecs-card',
  label: 'TechnicalSpecs Card',
  category: 'Components',
  content: renderToString(<TechnicalSpecsCard />),
  attributes: {
    class: 'technicalSpecs-card',
  },
}
