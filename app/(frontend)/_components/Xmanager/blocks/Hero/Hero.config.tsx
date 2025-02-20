'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { Hero } from './Hero'

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

export async function getHeroBlock() {
  return await createBlockConfig({
    id: 'hero',
    label: 'Hero Section',
    category: 'Sections',
    component: <Hero {...footballHeroData} />,
    attributes: {
      class: 'fa fa-header',
    },
  })
}
