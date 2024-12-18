import React from 'react'
import { DeliveryDetailsStyles } from './DeliveryDetails.styles'

export function DeliveryDetails() {
  return (
    <>
      <style>{DeliveryDetailsStyles}</style>
      <div className="delivery-details">
        <div className="details-box">
          <h3>How would you like to collect your order?</h3>
          <div className="radio-option">
            <input type="radio" id="deliver" name="delivery" />
            <label htmlFor="deliver">Deliver to me</label>
          </div>
          <h3>Confirm your address</h3>
          <div className="address-box">
            <p>Your location is</p>
            <p className="address">2077 Al Urubah Rd, Al Olaya, Riyadh 12244 7856, Saudi Arabia</p>
            <a href="#" className="edit-link">
              Edit Address
            </a>
          </div>
        </div>
      </div>

      <div className="contact-info">
        <div className="contact-card">
          <h3>Contact Information</h3>
          <div className="contact-row">
            <p className="name">Mahesh Rangabhat</p>
            <div className="icons">
              <i className="fas fa-pen edit-icon">✎</i>
              <i className="fas fa-trash-alt delete-icon">🗑</i>
            </div>
          </div>
          <div className="contact-details">
            <p className="phone">+966 124 478 8560</p>
            <p className="email">mahesh.rangabhat@tecnotree.com</p>
          </div>
        </div>
      </div>
    </>
  )
}
