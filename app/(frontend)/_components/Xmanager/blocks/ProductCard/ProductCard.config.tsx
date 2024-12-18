import { BlockProperties } from 'grapesjs'
import { ProductCard } from './ProductCard'
import { renderToString } from 'react-dom/server'

export const productCardBlock: BlockProperties = {
  id: 'productCard',
  label: 'ProductCard Banner',
  category: 'Components',
  content: renderToString(<ProductCard />),
  attributes: {
    class: 'productCard',
  },
}
