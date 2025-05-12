import React from 'react'
import { vasCardStyles } from './VasCard.styles'

export type VASCardProps = {
  title: string
  subtitle: string
  price: string
  upfrontPrice: string
  currency: string
}

export function VASCard({ title, subtitle, price, upfrontPrice, currency }: VASCardProps) {
  return (
    <>
      <style>{vasCardStyles}</style>
      <div className="vasCard">
        <h4 className="title">{title}</h4>
        <p className="subtitle">{subtitle}</p>
        <p className="price">
          {currency} {price}
        </p>
        <p className="upfront">
          {upfrontPrice !== '0.00' ? `${currency} ${upfrontPrice} / Upfront` : '0.00'}
        </p>
        <div className="cardFooter">
          <span className="compare">+ Compare</span>
          <button className="addToCart">Add To Cart</button>
        </div>
      </div>
    </>
  )
}
