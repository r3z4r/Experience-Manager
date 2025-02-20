'use server'

import { DeliveryDetails } from './DeliveryDetails'
import { createBlockConfig } from '../../utils/serverUtils'

export async function getDeliveryDetailsCardBlock() {
  return await createBlockConfig({
    id: 'deliverydetails-card',
    label: 'DeliveryDetails Card',
    category: 'Components',
    component: <DeliveryDetails />,
    attributes: {
      class: 'fa fa-map-marker',
    },
  })
}
