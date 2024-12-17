import React from 'react'
import { ModeOfPaymentStyles } from './ModeOfPayment.styles'

export function ModeOfPayment() {
  return (
    <>
      <style>{ModeOfPaymentStyles}</style>
      <div className="payment-section">
        <div className="payment-card">
          <h3>How would you like to Pay?</h3>
          <div className="payment-option">
            <label>
              <input type="radio" name="payment"/>
              Payment through Stripe
            </label>
          </div>
          <div className="payment-option">
            <label>
              <input type="radio" name="payment" />
              Internet Banking
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
