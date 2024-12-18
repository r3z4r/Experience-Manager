import { BlockProperties } from 'grapesjs'
import { DynamicHeader } from './DynamicHeader'
import { renderToString } from 'react-dom/server'

export const dynamicHeaderBlock: BlockProperties = {
  id: 'dynamic-header',
  label: 'Dynamic Header',
  category: 'Layout',
  content: renderToString(
    <DynamicHeader
      showLoginButton={false}
      tecnotreePosition="center"
      logoSrc="/xpm/images/Tecnotree.png"
    />,
  ),
  attributes: {
    class: 'dynamic-header',
  },
}
