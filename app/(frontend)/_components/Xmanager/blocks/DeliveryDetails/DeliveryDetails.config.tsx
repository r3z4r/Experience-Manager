import { BlockProperties } from 'grapesjs'
import { DeliveryDetails } from './DeliveryDetails'
import { renderToString } from 'react-dom/server'

export const DeliveryDetailsCardBlock: BlockProperties = {
  id: 'deliverydetails-card',
  label: 'DeliveryDetails Card',
  category: 'Components',
  content: renderToString(<DeliveryDetails />),
  attributes: {
    class: 'fa fa-map-marker',
  },
}
