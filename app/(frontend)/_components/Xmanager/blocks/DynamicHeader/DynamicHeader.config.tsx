import { BlockConfig } from '../types'
import { DynamicHeader } from './DynamicHeader'
import { renderToString } from 'react-dom/server'

export const dynamicHeaderBlock: BlockConfig = {
  id: 'dynamic-header',
  label: 'Dynamic Header',
  category: 'Layout',
  content: renderToString(
    <DynamicHeader
      showLoginButton={true}
      tecnotreePosition="left"
      logoSrc="/xpm/images/Tecnotree.png"
    />,
  ),
  attributes: {
    class: 'dynamic-header',
  },
}
