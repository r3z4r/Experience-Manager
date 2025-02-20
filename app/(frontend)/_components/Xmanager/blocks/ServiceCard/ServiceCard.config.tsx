'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { ServiceCard } from './ServiceCard'

export async function getServiceCardBlock() {
  return await createBlockConfig({
    id: 'service-card',
    label: 'Service Card',
    category: 'Components',
    component: <ServiceCard />,
    attributes: {
      class: 'fa fa-cube',
    },
  })
}
