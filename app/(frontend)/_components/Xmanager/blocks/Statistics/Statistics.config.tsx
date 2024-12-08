import { BlockConfig } from '../types'
import { Statistics } from './Statistics'
import { renderToString } from 'react-dom/server'
import { statisticsStyles } from './Statistics.styles'

const defaultStats = [
  { percentage: 15, description: 'reduction in customer churn' },
  { percentage: 10, description: 'increase in ARPU' },
  { percentage: 25, description: 'improvement in operational efficiency' },
  { percentage: 30, description: 'boost in customer satisfaction scores' },
]

export const statisticsBlock: BlockConfig = {
  id: 'statistics',
  label: 'Statistics Block',
  category: 'Components',
  content: renderToString(<Statistics items={defaultStats} />),
  attributes: {
    class: 'statistics-block',
  },
  css: statisticsStyles,
}
