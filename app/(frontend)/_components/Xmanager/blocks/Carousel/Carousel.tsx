import { CarouselProps } from '../types'
import { carouselStyles } from './Carousel.styles'

export function Carousel({ items = [] }: CarouselProps) {
  return (
    <>
      <style>{carouselStyles}</style>
      <section className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-track">
            {items.map((item, index) => (
              <div key={index} className="carousel-item">
                <div className="carousel-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
