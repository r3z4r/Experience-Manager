'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { CreditCardForm } from './CreditCardForm'

export async function getCreditCardFormBlock() {
  return await createBlockConfig({
    id: 'credit-card-form',
    label: 'Credit Card Form',
    category: 'Sections',
    component: <CreditCardForm />,
    attributes: {
      class: 'fa fa-credit-card',
    },
  })
}
