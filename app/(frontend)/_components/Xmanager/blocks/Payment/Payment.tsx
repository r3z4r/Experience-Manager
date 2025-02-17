import React from 'react'
import { paymentStyles } from './Payment.styles'
import { CreditCard, Globe, Lock } from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

export function PaymentBlock(): React.ReactElement {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit or debit card',
      icon: <CreditCard className="payment-icon" />,
      description: 'Secure payment with credit or debit card',
    },
    {
      id: 'bank',
      name: 'Online Banking',
      icon: <Globe className="payment-icon" />,
      description: 'Pay directly from your bank account',
    },
  ]

  return (
    <>
      <style>{paymentStyles}</style>
      <div className="payment-container">
        <div className="payment-header">
          <h2 className="payment-title">Payment Method</h2>
          <div className="secure-badge">
            <Lock className="lock-icon" />
            <span>Secure payment</span>
          </div>
        </div>

        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <label key={method.id} className="payment-method-option">
              <input type="radio" name="paymentMethod" value={method.id} />
              <div className="payment-method-content">
                <div className="payment-method-icon">{method.icon}</div>
                <div className="payment-method-details">
                  <span className="payment-method-name">{method.name}</span>
                  <span className="payment-method-description">{method.description}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="card-details-section">
          <div className="form-row">
            <div className="form-group">
              <label>Card number</label>
              <input type="text" placeholder="1234 1234 1234 1234" />
            </div>
          </div>
          <div className="form-row two-columns">
            <div className="form-group">
              <label>Expiry date</label>
              <input type="text" placeholder="MM / YY" />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <input type="text" placeholder="123" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Name on card</label>
              <input type="text" placeholder="Full name on card" />
            </div>
          </div>
        </div>

        <div className="payment-footer">
          <button className="pay-button">Pay {/* Amount can be passed as prop */}</button>
          <p className="payment-disclaimer">
            Your payment information is processed securely. We do not store credit card details
          </p>
        </div>
      </div>
    </>
  )
}
