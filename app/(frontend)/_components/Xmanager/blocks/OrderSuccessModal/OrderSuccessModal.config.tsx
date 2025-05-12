'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { OrderSuccessModal } from './OrderSuccessModal'

export async function getOrderSuccessModalBlock() {
  return await createBlockConfig({
    id: 'order-success-modal',
    label: 'Order Success Modal',
    category: 'Components',
    component: (
      <OrderSuccessModal
        message="Order Submitted Successfully"
        subMessage="DATA BAR FOR POSTPAID"
        requestId="PI214911"
        // onClose={() => {}}
      />
    ),
    attributes: {
      class: 'fa fa-check-circle',
    },
  })
}
