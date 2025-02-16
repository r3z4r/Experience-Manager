import { BlockProperties } from 'grapesjs'
import { MomentsHeader } from './MomentsHeader'
import { renderToString } from 'react-dom/server'

export const momentsHeaderBlock: BlockProperties = {
  id: 'moments-header',
  label: 'Sticky Navigation Bar',
  category: 'Layout',
  content: renderToString(<MomentsHeader />),
  attributes: {
    class: 'moments-header',
  },
}
