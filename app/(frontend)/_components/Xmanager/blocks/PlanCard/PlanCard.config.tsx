import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { PlanCard } from './PlanCard'

const defaultPlanData = {
  title: 'Global Traveler',
  price: '$29.99',
  features: [
    'No activation fees',
    'Instant digital delivery',
    '24/7 customer support',
    'Multi-device compatibility',
  ],
  dataAmount: '10GB',
  validity: '30 days',
  coverage: ['Europe', 'Americas', 'Asia'],
  isPopular: true,
}

export const planCardBlock: BlockProperties = {
  id: 'plan-card',
  label: 'Plan Card',
  category: 'Components',
  content: renderToString(<PlanCard {...defaultPlanData} />),
  attributes: {
    class: 'fa fa-percent',
  },
}
