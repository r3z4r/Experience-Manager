import { ServiceCardProps } from '../types'
import { serviceCardStyles } from './ServiceCard.styles'

export function ServiceCard({
  className = '',
  title = 'Online Consultation',
  description = 'Connect with healthcare professionals from the comfort of your home',
  imageUrl = 'https://moments-healthcare.tecnotree.com/assets/images/services/consultation.jpg',
}: ServiceCardProps) {
  return (
    <>
      <style>{serviceCardStyles}</style>
      <div className="service-card">
        <div className="service-image">
          <img src={imageUrl} alt={title} />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="service-btn">Book Now</button>
      </div>
    </>
  )
}
