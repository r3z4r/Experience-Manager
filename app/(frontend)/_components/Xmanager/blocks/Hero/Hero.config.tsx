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

const footballHeroData = {
  title: 'Stay Connected at the Match',
  subtitle: 'Get your eSIM for seamless connectivity while supporting your team',
  backgroundImage: '/images/football-stadium.jpg', // Placeholder stadium image
  ctaText: 'Get Your eSIM',
  ctaUrl: '/plans',
}

export const heroBlock: BlockProperties = {
  id: 'hero-banner',
  label: 'Hero Banner',
  category: 'Sections',
  content: renderToString(<Hero {...footballHeroData} />),
  attributes: {
    class: 'fa fa-star',
  },
}
