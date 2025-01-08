import { CartCardProps } from '../types'
import { cardStyles } from './CartCard.styles'

export const CartCard: React.FC<CartCardProps> = ({
  title,
  description,
  featureList,
  highlightsList,
  imageUrl,
  buttonText,
  buttonUrl,
}) => {
  return (
    <>
      <style>{cardStyles}</style>
      <div className={`card`}>
        <div className={`card-image`}>
          <img src={imageUrl} alt={title} />
        </div>

        <div className={``}>
          <h2 className="card-title">{title}</h2>
          <div className="card-description">{description}</div>

          <div className="card-list-item">
            <div>
              {featureList && (
                <div>
                  <div className="card-subTitle">Features: </div>
                  <ul className="card-list">
                    {featureList.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              {highlightsList && (
                <div>
                  <div className="card-subTitle">Highlights: </div>
                  <ul className="card-list">
                    {highlightsList.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="card-actions flex justify-end">
            <a href={buttonUrl} className="card-button">
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
