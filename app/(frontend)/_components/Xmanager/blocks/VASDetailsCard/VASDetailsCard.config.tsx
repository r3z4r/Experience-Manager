'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { VASCardDetails } from './VASDetailsCard'

export async function getVASDetailsCardBlock() {
  return await createBlockConfig({
    id: 'vas-card-details',
    label: 'VAS Card Details',
    category: 'Components',
    component: (
      <VASCardDetails
        title="DATA BAR FOR POSTPAID"
        subtitle="GSM – Mobile – Postpaid"
        sectionTitle="Usage & Allowances"
        offerDetails="Get 20GB of high-speed data per month. Unused data rolls over to next month. Priority customer support and international roaming included."
      />
    ),
    attributes: {
      class: 'fa fa-info-circle',
    },
  })
}
