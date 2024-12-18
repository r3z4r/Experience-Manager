import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { CartItems } from './CartItems'

export const cartitemsCardBlock: BlockProperties = {
  id: 'cartitems-card',
  label: 'Cart Items',
  category: 'Components',
  content: renderToString(<CartItems />),
  attributes: {
    class: 'cartitems-card',
  },
}
