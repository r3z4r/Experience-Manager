import { BlockConfig } from '../types'
import { MomentsHeader } from './MomentsHeader'
import { renderToString } from 'react-dom/server'

export const momentsHeaderBlock: BlockConfig = {
  id: 'moments-header',
  label: 'Moments Header',
  category: 'Layout',
  content: renderToString(<MomentsHeader />),
  attributes: {
    class: 'moments-header',
  },
}
