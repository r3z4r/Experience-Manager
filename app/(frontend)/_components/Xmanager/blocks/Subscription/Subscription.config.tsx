'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { Subscription } from './Subscription'

export async function getSubscriptionBlock() {
  return await createBlockConfig({
    id: 'subscription',
    label: 'Subscription Section',
    category: 'Sections',
    component: <Subscription />,
    attributes: {
      class: 'fa fa-refresh',
    },
  })
}
