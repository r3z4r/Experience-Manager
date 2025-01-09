import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { ProductsSection } from './ProductSelection'

export const productSelectionBlock: BlockProperties = {
  id: 'productSelection',
  label: 'ProductSelection Card',
  category: 'Components',
  content: renderToString(<ProductsSection />),
  attributes: {
    class: 'productSelection',
  },
}
