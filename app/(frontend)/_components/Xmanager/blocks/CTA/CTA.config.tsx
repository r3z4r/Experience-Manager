import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { CTA } from './CTA'

const defaultCTAData = {
  title: 'Ready to Stay Connected?',
  description: 'Get your eSIM now and enjoy seamless connectivity during your travels',
  buttonText: 'Get Started',
  buttonUrl: '#plans',
  backgroundImage: '/images/travel-bg.jpg',
}

export const ctaBlock: BlockProperties = {
  id: 'cta-section',
  label: 'CTA Section',
  category: 'Sections',
  content: renderToString(<CTA {...defaultCTAData} />),
  attributes: {
    class: 'fa fa-bullhorn',
  },
}
