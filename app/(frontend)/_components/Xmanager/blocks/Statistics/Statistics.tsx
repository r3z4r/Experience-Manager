import { StatisticsProps } from '../types'
import { statisticsStyles } from './Statistics.styles'

export const Statistics: React.FC<StatisticsProps> = ({ items, className = '' }) => {
  return (
    <>
      <style>{statisticsStyles}</style>
      <div className={`statistics-block ${className}`}>
        <div className="stats-grid">
          {items?.map((item, index) => (
            <div key={index} className="stat-item">
              <div className="percentage">{item.percentage}%</div>
              <div className="description">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
