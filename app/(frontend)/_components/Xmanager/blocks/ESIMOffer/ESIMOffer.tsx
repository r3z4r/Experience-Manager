import React from 'react'
import { esimOfferStyles } from './ESIMOffer.styles'
import { Globe, Shield, Zap } from 'lucide-react'

interface ESIMPlan {
  id: string
  name: string
  data: string
  validity: string
  coverage: string[]
  originalPrice: string
  discountedPrice: string
}

interface ESIMOfferProps {
  plans: ESIMPlan[]
  onSelect: (plan: ESIMPlan) => void
  onDecline: () => void
}

export function ESIMOffer({ plans, onSelect, onDecline }: ESIMOfferProps) {
  return (
    <>
      <style>{esimOfferStyles}</style>
      <div className="esim-offer">
        <div className="offer-header">
          <h2 className="offer-title">Special eSIM Offer</h2>
          <p className="offer-subtitle">
            Stay connected globally with our exclusive eSIM plans at special rates
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <Globe className="benefit-icon" />
            <h3>Global Coverage</h3>
            <p>Connect in 190+ countries</p>
          </div>
          <div className="benefit-item">
            <Zap className="benefit-icon" />
            <h3>Instant Activation</h3>
            <p>Ready to use in minutes</p>
          </div>
          <div className="benefit-item">
            <Shield className="benefit-icon" />
            <h3>Secure Connection</h3>
            <p>Bank-grade security</p>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-details">
                <p className="data-amount">{plan.data}</p>
                <p className="validity">{plan.validity}</p>
                <p className="coverage">{plan.coverage.join(', ')}</p>
              </div>
              <div className="price-section">
                <span className="original-price">{plan.originalPrice}</span>
                <span className="discounted-price">{plan.discountedPrice}</span>
              </div>
              <button className="select-button" onClick={() => onSelect(plan)}>
                Add to Application
              </button>
            </div>
          ))}
        </div>

        <button className="decline-button" onClick={onDecline}>
          No thanks, continue without eSIM
        </button>
      </div>
    </>
  )
}
