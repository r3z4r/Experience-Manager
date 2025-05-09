'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { VASCard } from './VasCard'

export async function getVASCardBlock() {
  return await createBlockConfig({
    id: 'vas-card',
    label: 'VAS Card',
    category: 'Components',
    component: (
      <VASCard
        title="Bulk SMS VAS"
        subtitle="GSM-Mobile-Postpaid"
        price="117.50"
        upfrontPrice="235.00"
        currency="USD"
      />
    ),
    attributes: {
      class: 'fa fa-box',
    },
  })
}
