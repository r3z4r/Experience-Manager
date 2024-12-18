import { BlockProperties } from 'grapesjs'
import { Footer } from './Footer'
import { renderToString } from 'react-dom/server'

export const footerBlock: BlockProperties = {
  id: 'footer',
  label: 'Footer',
  category: 'Layout',
  content: renderToString(<Footer />),
  attributes: {
    class: 'footer',
  },
}
