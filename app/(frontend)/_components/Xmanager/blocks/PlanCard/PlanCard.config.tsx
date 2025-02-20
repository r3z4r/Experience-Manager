'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { PlanCard } from './PlanCard'

const defaultPlanData = {
  title: 'Match Day eSIM Basic',
  price: '€19.99',
  features: ['5GB Data', 'Valid for 7 days', 'Local calls included', 'Stadium priority network'],
  dataAmount: '5GB',
  validity: '7 days',
  coverage: ['Stadium', 'City Center'],
  isPopular: false,
  type: 'eSIM' as const,
}

export async function getPlanCardBlock() {
  return await createBlockConfig({
    id: 'plan-card',
    label: 'Plan Card',
    category: 'Components',
    component: <PlanCard {...defaultPlanData} />,
    attributes: {
      class: 'fa fa-credit-card',
    },
  })
}
