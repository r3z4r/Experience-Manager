import { BlockProperties } from 'grapesjs'
import { HeadingBanner } from './HeadingBanner'
import { renderToString } from 'react-dom/server'

export const headingBannerBlock: BlockProperties = {
  id: 'heading-banner-layout',
  label: 'Heading Banner Layout',
  category: 'Layout',
  content: renderToString(<HeadingBanner />),
  attributes: {
    class: 'heading-banner-layout',
  },
}
