import { BlockConfig } from '../types'
import { Hero } from './Hero'
import { renderToString } from 'react-dom/server'

export const heroBlock: BlockConfig = {
  id: 'hero',
  label: 'Hero Banner',
  category: 'Sections',
  content: renderToString(<Hero />),
  attributes: {
    class: 'hero-section',
  },
}
