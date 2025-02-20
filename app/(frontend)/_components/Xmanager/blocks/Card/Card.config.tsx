'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { Card } from './Card'

const defaultCardLeft = {
  title: 'Seamless GenAI Integration',
  listItems: [
    'Infuse GenAI intelligence throughout your entire BSS ecosystem',
    'Enhance decision-making with AI-driven insights',
  ],
  imageUrl: '/xpm/placeholder.jpg',
  buttonText: 'Know More',
  buttonUrl: '#',
  imagePosition: 'right' as const,
}

const defaultCardRight = {
  title: 'Telecom-Specific Large Language Models (LLMs)',
  listItems: [
    'Leverage GenAI models trained on vast telecom datasets',
    'Generate human-like responses for customer service and internal operations',
    'Continuously improve with ongoing learning from your unique data',
  ],
  imageUrl: '/xpm/placeholder.jpg',
  buttonText: 'Know More',
  buttonUrl: '#',
  imagePosition: 'left' as const,
}

export async function getCardBlock() {
  return await createBlockConfig({
    id: 'feature-card',
    label: 'Feature Card',
    category: 'Components',
    component: <Card {...defaultCardLeft} />,
    attributes: {
      class: 'feature-card',
      'data-image-position': 'right',
    },
  })
}

export async function getCardRightBlock() {
  return await createBlockConfig({
    id: 'feature-card-right',
    label: 'Feature Card (Image Right)',
    category: 'Components',
    component: <Card {...defaultCardRight} />,
    attributes: {
      class: 'feature-card',
      'data-image-position': 'left',
    },
  })
}
