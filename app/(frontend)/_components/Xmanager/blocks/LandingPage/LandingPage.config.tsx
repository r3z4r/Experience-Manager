'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import UaeLandingScreen from './LandingPage'

export async function getUaeLandingScreenBlock() {
  return await createBlockConfig({
    id: 'uae-landing',
    label: 'UAE Landing Screen',
    category: 'Pages',
    component: <UaeLandingScreen />,
    attributes: {
      class: 'fa fa-flag',
    },
  })
}
