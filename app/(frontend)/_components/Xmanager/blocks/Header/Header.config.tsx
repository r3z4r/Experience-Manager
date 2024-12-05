import { BlockConfig } from '../types'
import { Header } from './Header'
import { renderToString } from 'react-dom/server'

export const headerBlock: BlockConfig = {
  id: 'header',
  label: 'Basic Header',
  category: 'Layout',
  content: renderToString(<Header />),
  attributes: {
    class: 'basic-header',
  },
}
