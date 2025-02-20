'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { PaymentBlock } from './Payment'

export async function getPaymentBlock() {
  return await createBlockConfig({
    id: 'payment',
    label: 'Payment Section',
    category: 'Sections',
    component: <PaymentBlock />,
    attributes: {
      class: 'fa fa-credit-card',
    },
  })
}
