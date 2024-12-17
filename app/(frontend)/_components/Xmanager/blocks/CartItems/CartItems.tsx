import React from 'react'
import { CartItemsStyles } from './CartItems.styles'

export function CartItems() {
  return (
    <>
      <style>{CartItemsStyles}</style>
      <div className="cart-checkout-container">
        <div className="cart-container">
          <div className="cart-card">
            <div className="cart-item">
              <img src="iphone.png" alt="iPhone 16 Pro" className="product-img" />
              <div className="item-details">
                <div className="row">
                  <p className="product-title">iPhone 16 Pro 256GB</p>
                  <p className="product-title">5,310 SR</p>
                </div>
                <div className="row">
                  <p className="product-info">Standalone</p>
                  <p className="product-time">One Time</p>
                </div>
                <p className="product-color">
                  Color: <span className="bold-text">Black</span>
                </p>
                <p className="product-capacity">
                  Capacity: <span className="bold-text">256 GB</span>
                </p>
                <p className="payment-method">
                  Payment Method: <span className="bold-text">Full Price</span>
                </p>
                <div className="icons">
                  <span className="edit-icon" title="Edit">
                    &#9998;
                  </span>
                  <span className="delete-icon" title="Delete">
                    &#128465;
                  </span>
                </div>
                <div className="vat-container">
                  <p className="vat-paragraph">15% VAT included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-box">
          <h3 className="checkout-title">Quickly checkout with</h3>
          <ul className="checkout-list">
            <li>Your name and contact details</li>
            <li>Your ID</li>
            <li>Delivery address if required</li>
          </ul>
          <h4 className="pay-title">Pay securely with</h4>
          <div className="payment-logos">
            <img src="visa.png" alt="Visa" className="pay-logo" />
            <img src="mastercard.png" alt="Mastercard" className="pay-logo" />
            <img src="mada.png" alt="Mada" className="pay-logo" />
          </div>
        </div>
      </div>
    </>
  )
}