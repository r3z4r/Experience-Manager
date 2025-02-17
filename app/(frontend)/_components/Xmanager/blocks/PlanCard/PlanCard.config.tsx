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
  type: 'eSIM',
}

const matchDayPlans = [
  {
    title: 'Match Day eSIM Basic',
    price: '€19.99',
    features: [
      '5GB Data',
      'Valid for 7 days',
      'Local calls included',
      'Stadium priority network',
      'Instant digital delivery',
    ],
    dataAmount: '5GB',
    validity: '7 days',
    coverage: ['Stadium', 'City Center'],
    isPopular: false,
    type: 'eSIM',
  },
  {
    title: 'Match Day Physical SIM Basic',
    price: '€24.99',
    features: [
      '5GB Data',
      'Valid for 7 days',
      'Local calls included',
      'Stadium priority network',
      'Physical SIM delivery',
      'Standard shipping included',
    ],
    dataAmount: '5GB',
    validity: '7 days',
    coverage: ['Stadium', 'City Center'],
    isPopular: false,
    type: 'Physical SIM',
  },
  {
    title: 'Tournament eSIM Pro',
    price: '€49.99',
    features: [
      '15GB Data',
      'Valid for 30 days',
      'International calls included',
      'Stadium priority network',
      'Club app streaming',
      'Instant digital delivery',
    ],
    dataAmount: '15GB',
    validity: '30 days',
    coverage: ['Nationwide'],
    isPopular: true,
    type: 'eSIM',
  },
  {
    title: 'Tournament Physical SIM Pro',
    price: '€54.99',
    features: [
      '15GB Data',
      'Valid for 30 days',
      'International calls included',
      'Stadium priority network',
      'Club app streaming',
      'Express shipping included',
    ],
    dataAmount: '15GB',
    validity: '30 days',
    coverage: ['Nationwide'],
    isPopular: false,
    type: 'Physical SIM',
  },
]

interface PlanCardProps {
  title: string
  price: string
  features: string[]
  dataAmount: string
  validity: string
  coverage: string[]
  isPopular?: boolean
  type: 'eSIM' | 'Physical SIM'
}

// Update the PlanCard styles to include a type badge
export const planCardStyles = `
  /* Existing styles... */

  .plan-type-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .plan-type-badge.esim {
    background-color: #3b82f6;
    color: white;
  }

  .plan-type-badge.physical {
    background-color: #10b981;
    color: white;
  }
`

export const planCardBlock: BlockProperties = {
  id: 'plan-card',
  label: 'Plan Card',
  category: 'Components',
  content: renderToString(<PlanCard {...(matchDayPlans[2] as PlanCardProps)} />),
  attributes: {
    class: 'fa fa-percent',
  },
}
