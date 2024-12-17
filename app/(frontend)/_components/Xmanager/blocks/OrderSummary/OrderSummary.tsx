import React from 'react'
import { OrderSummaryStyles } from './OrderSummary.styles'

export function OrderSummary(){

  return (
    <>
      <style>{OrderSummaryStyles}</style>
      <div className="order-summary">
        <div className="summary-card">
          <div className="product-row">
          <img src='/images/5n1dTTOB1.jpg' alt="Therapy Team" className="product-img"/>
            <div className="product-details">
              <h3 className="product-name">iPhone 16 Pro 256GB</h3>
              <p className="product-subtitle">Standalone &bull; One Time</p>
            </div>
            <p className="product-price">5,310 SR</p>
          </div>
          <div className="delivery-row">
            <p className="delivery-text">Delivery Charges</p>
            <p className="delivery-price">
              <span className="strikethrough">2 SR</span>
              <span className="free">FREE</span>
            </p>
          </div>
          <hr />
          <div className="total-row">
            <p className="delivery-text">Total Price</p>
            <p className="total-price">5,310 SR</p>
          </div>
        </div>
      </div>
    </>
  )
}
