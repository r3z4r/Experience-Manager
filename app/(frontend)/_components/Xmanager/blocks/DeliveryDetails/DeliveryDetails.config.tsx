import { BlockConfig } from '../types'
import { DeliveryDetails } from './DeliveryDetails'
import { renderToString } from 'react-dom/server'

export const DeliveryDetailsCardBlock: BlockConfig = {
  id: 'deliverydetails-card',
  label: 'DeliveryDetails Card',
  category: 'Components',
  content: renderToString(<DeliveryDetails />),
  attributes: {
    class: 'deliverydetails-card',
  },
}
