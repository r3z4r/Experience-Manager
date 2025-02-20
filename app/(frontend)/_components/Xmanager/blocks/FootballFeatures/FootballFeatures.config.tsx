'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { FootballFeatures } from './FootballFeatures'

export async function getFootballFeaturesBlock() {
  return await createBlockConfig({
    id: 'football-features',
    label: 'Football Features',
    category: 'Sections',
    component: <FootballFeatures />,
    attributes: {
      class: 'fa fa-futbol',
    },
  })
}
