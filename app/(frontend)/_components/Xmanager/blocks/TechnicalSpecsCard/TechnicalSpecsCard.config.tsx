'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { TechnicalSpecsCard } from './TechnicalSpecsCard'

export async function getTechnicalSpecsCardBlock() {
  return await createBlockConfig({
    id: 'technical-specs-card',
    label: 'Technical Specs Card',
    category: 'Components',
    component: <TechnicalSpecsCard />,
    attributes: {
      class: 'fa fa-cogs',
    },
  })
}
