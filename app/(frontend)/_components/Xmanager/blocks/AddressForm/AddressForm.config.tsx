'use server'

import { createBlockConfig } from '../../utils/serverUtils'
import { AddressForm } from './AddressForm'

export async function getAddressFormBlock() {
  const defaultAddressForm = {
    streetAddress: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
  }

  return await createBlockConfig({
    id: 'addressForm',
    label: 'Address Form',
    category: 'Components',
    component: <AddressForm {...defaultAddressForm} />,
    attributes: {
      class: 'fa fa-address-card',
    },
  })
}
