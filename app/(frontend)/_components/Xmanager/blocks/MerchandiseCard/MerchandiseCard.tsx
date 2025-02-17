import React from 'react'
import { merchandiseStyles } from './MerchandiseCard.styles'

interface MerchandiseProps {
  title: string
  image: string
  price: string
  description: string
  sizes: string[]
}

export function MerchandiseCard({ title, image, price, description, sizes }: MerchandiseProps) {
  return (
    <>
      <style>{merchandiseStyles}</style>
      <div className="merch-card">
        <img src={image} alt={title} className="merch-image" />
        <div className="merch-content">
          <h3 className="merch-title">{title}</h3>
          <p className="merch-description">{description}</p>
          <div className="merch-sizes">
            {sizes.map((size) => (
              <button key={size} className="size-button">
                {size}
              </button>
            ))}
          </div>
          <div className="merch-price">{price}</div>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </>
  )
}
