import { BlockConfig } from '../types'
import { FooterBanner } from './FooterBanner'
import { renderToString } from 'react-dom/server'

export const footerBannerBlock: BlockConfig = {
  id: 'footerBanner',
  label: 'Footer Banner',
  category: 'Layout',
  content: renderToString(<FooterBanner />),
  attributes: {
    class: 'footerBanner',
  },
}
