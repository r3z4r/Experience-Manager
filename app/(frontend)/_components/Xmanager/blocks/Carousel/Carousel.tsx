import { CarouselProps } from '../types'
import { carouselStyles } from './Carousel.styles'

export function Carousel({
  className = '',
  items = [
    {
      imageUrl: '/images/service1.jpg',
      title: 'Online Consultation',
      description: 'Connect with healthcare professionals remotely',
    },
    {
      imageUrl: '/images/service2.jpg',
      title: 'Lab Tests',
      description: 'Book lab tests and health checkups',
    },
    {
      imageUrl: '/images/service3.jpg',
      title: 'Medicine Delivery',
      description: 'Get medicines delivered to your doorstep',
    },
  ],
}: CarouselProps) {
  return (
    <>
      <style>{carouselStyles}</style>
      <section className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-track">
            {items.map((item, index) => (
              <div key={index} className="carousel-item">
                <div className="carousel-image">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
