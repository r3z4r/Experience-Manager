import { BlockConfig } from '../types'
import { Footer } from './Footer'
import { renderToString } from 'react-dom/server'

export const footerBlock: BlockConfig = {
  id: 'footer',
  label: 'Footer',
  category: 'Layout',
  content: renderToString(<Footer />),
  attributes: {
    class: 'footer',
  },
}
