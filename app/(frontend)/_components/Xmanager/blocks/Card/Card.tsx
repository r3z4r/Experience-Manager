import { CardProps } from '../types'
import { cardStyles } from './Card.styles'

export const Card: React.FC<CardProps> = ({
  title,
  listItems,
  imageUrl,
  buttonText,
  buttonUrl,
  imagePosition = 'right',
  className = '',
}) => {
  return (
    <>
      <style>{cardStyles}</style>
      <div className={`feature-card image-${imagePosition} ${className}`}>
        <div className="feature-content">
          <h2 className="feature-title">{title}</h2>
          <ul className="feature-list">
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <a href={buttonUrl} className="feature-button">
            {buttonText}
          </a>
        </div>
        <div className="feature-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} />
        </div>
      </div>
    </>
  )
}
