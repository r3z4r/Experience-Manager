import { SubscriptionProps } from '../types'
import { subscriptionStyles } from './Subscription.styles'

export function Subscription({
  className = '',
  title = 'Therapy Session',
  price = '₹300.00',
  period = '/Weekly',
  packageType = 'Therapy Session',
  sessions = 3,
  description = 'Make an appointment with your preferred therapist starting with:',
  imageUrl = '/images/therapy-team.jpg',
}: SubscriptionProps) {
  return (
    <>
      <style>{subscriptionStyles}</style>
      <section className="subscription-section">
        <div className="subscription-container">
          <div className="subscription-image">
            <img src={imageUrl} alt="Therapy Team" />
          </div>
          <div className="subscription-content">
            <h2>{title}</h2>
            <p className="description">{description}</p>
            <div className="price-tag">
              <span className="price">{price}</span>
              <span className="period">{period}</span>
            </div>
            <ul className="features">
              <li>Package Type: {packageType}</li>
              <li>Number of sessions: {sessions}</li>
            </ul>
            <p className="note">This plan renews automatically, unless cancelled by the user.</p>
            <button className="subscribe-button">Buy Subscription</button>
          </div>
        </div>
      </section>
    </>
  )
}
