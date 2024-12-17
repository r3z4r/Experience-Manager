import { BlockConfig } from '../types'
import { renderToString } from 'react-dom/server'
import { CartItems } from './CartItems'

export const cartitemsCardBlock: BlockConfig = {
  id: 'cartitems-card',
  label: 'Cart Items',
  category: 'Components',
  content: renderToString(<CartItems />),
  attributes: {
    class: 'cartitems-card',
  },
}
