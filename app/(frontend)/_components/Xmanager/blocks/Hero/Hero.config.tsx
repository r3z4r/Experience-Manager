import { BlockProperties } from 'grapesjs'
import { Hero } from './Hero'
import { renderToString } from 'react-dom/server'

const defaultHeroData = {
  title: 'Stay Connected Worldwide',
  subtitle: 'Travel with confidence using our global e-SIM solutions',
  backgroundImage: '/images/hero-bg.jpg',
  ctaText: 'Explore Plans',
  ctaUrl: '#plans',
}

export const heroBlock: BlockProperties = {
  id: 'hero-banner',
  label: 'Hero Banner',
  category: 'Sections',
  content: renderToString(<Hero {...defaultHeroData} />),
  attributes: {
    class: 'fa fa-star',
  },
}
