import { BlockProperties } from 'grapesjs'
import { FooterBanner } from './FooterBanner'
import { renderToString } from 'react-dom/server'

export const footerBannerBlock: BlockProperties = {
  id: 'footerBanner',
  label: 'Footer Banner',
  category: 'Layout',
  content: renderToString(<FooterBanner />),
  attributes: {
    class: 'footerBanner',
  },
}
