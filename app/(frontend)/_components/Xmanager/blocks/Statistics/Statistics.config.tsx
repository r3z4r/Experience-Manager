import { BlockProperties } from 'grapesjs'
import { Statistics } from './Statistics'
import { renderToString } from 'react-dom/server'

const defaultStats = [
  { percentage: 15, description: 'reduction in customer churn' },
  { percentage: 10, description: 'increase in ARPU' },
  { percentage: 25, description: 'improvement in operational efficiency' },
  { percentage: 30, description: 'boost in customer satisfaction scores' },
]

export const statisticsBlock: BlockProperties = {
  id: 'statistics',
  label: 'Statistics Block',
  category: 'Components',
  content: renderToString(<Statistics items={defaultStats} />),
  attributes: {
    class: 'fa fa-bar-chart',
  },
}
