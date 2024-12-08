import { BlockConfig } from '../types'
import { Card } from './Card'
import { renderToString } from 'react-dom/server'
import { cardStyles } from './Card.styles'

const defaultCardLeft = {
  title: 'Seamless GenAI Integration with Tecnotree BSS',
  listItems: [
    'Infuse GenAI intelligence throughout your entire BSS ecosystem',
    'Enhance decision-making with AI-driven insights at every touchpoint',
    'Ensure consistent, intelligent experiences across all operations',
  ],
  imageUrl: '/placeholder.jpg',
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
  imageUrl: '/placeholder.jpg',
  buttonText: 'Know More',
  buttonUrl: '#',
  imagePosition: 'left' as const,
}

export const cardBlock: BlockConfig = {
  id: 'feature-card',
  label: 'Feature Card',
  category: 'Components',
  content: renderToString(<Card {...defaultCardLeft} />),
  attributes: {
    class: 'feature-card',
    'data-image-position': 'right',
  },
  css: cardStyles,
}

export const cardRightBlock: BlockConfig = {
  id: 'feature-card-right',
  label: 'Feature Card (Image Right)',
  category: 'Components',
  content: renderToString(<Card {...defaultCardRight} />),
  attributes: {
    class: 'feature-card',
    'data-image-position': 'left',
  },
  css: cardStyles,
}
