'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { CTA } from './CTA'

const defaultCTAData = {
  title: 'Ready to Stay Connected?',
  description: 'Get your eSIM now and enjoy seamless connectivity during your travels',
  buttonText: 'Get Started',
  buttonUrl: '#plans',
  backgroundImage: '/images/travel-bg.jpg',
}

export async function getCtaBlock() {
  return await createBlockConfig({
    id: 'cta',
    label: 'Call to Action',
    category: 'Sections',
    component: <CTA {...defaultCTAData} />,
    attributes: {
      class: 'fa fa-bullhorn',
    },
  })
}
