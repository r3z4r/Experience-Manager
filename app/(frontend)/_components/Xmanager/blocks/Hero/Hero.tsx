import { HeroProps } from '../types'
import { heroStyles } from './Hero.styles'

export function Hero({
  className = '',
  title = 'Healthcare Made Simple',
  subtitle = 'Access quality healthcare services anytime, anywhere',
  imageUrl = 'https://moments-healthcare.tecnotree.com/assets/images/banner/banner1.jpg',
}: HeroProps) {
  return (
    <>
      <style>{heroStyles}</style>
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <div className="hero-cta">
              <button className="primary-button">Book Appointment</button>
              <button className="secondary-button">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <img src={imageUrl} alt="Healthcare Services" width={1200} height={600} />
          </div>
        </div>
      </section>
    </>
  )
}
