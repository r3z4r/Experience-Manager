import { BlockConfig } from '../types'
import { ProductCard } from './ProductCard'
import { renderToString } from 'react-dom/server'

export const productCardBlock: BlockConfig = {
  id: 'productCard',
  label: 'ProductCard Banner',
  category: 'Components',
  content: renderToString(<ProductCard />),
  attributes: {
    class: 'productCard',
  },
}
