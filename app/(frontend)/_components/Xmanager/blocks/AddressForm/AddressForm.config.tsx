import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { AddressForm } from './AddressForm'

const defaultAddressForm = {
  streetAddress: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
}

export const addressFormBlock: BlockProperties = {
  id: 'addressForm',
  label: 'Address Form',
  category: 'Components',
  content: renderToString(<AddressForm {...defaultAddressForm} />),
  attributes: {
    class: 'addressForm',
  },
}
