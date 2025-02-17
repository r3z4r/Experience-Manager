import { BlockProperties } from 'grapesjs'
import { renderToString } from 'react-dom/server'
import { FootballFeatures } from './FootballFeatures'

export const footballFeaturesBlock: BlockProperties = {
  id: 'football-features',
  label: 'Football Features',
  category: 'Sections',
  content: renderToString(<FootballFeatures />),
  attributes: {
    class: 'fa fa-futbol',
  },
}
