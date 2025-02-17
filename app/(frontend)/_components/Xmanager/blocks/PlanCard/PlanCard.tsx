import React from 'react'
import { CheckIcon } from 'lucide-react'
import { planCardStyles } from './PlanCard.styles'

interface PlanCardProps {
  title: string
  price: string
  features: string[]
  dataAmount: string
  validity: string
  coverage: string[]
  isPopular?: boolean
  type: 'eSIM' | 'Physical SIM'
}

export function PlanCard({
  title,
  price,
  features,
  dataAmount,
  validity,
  coverage,
  isPopular,
  type,
}: PlanCardProps) {
  return (
    <>
      <style>{planCardStyles}</style>
      <div className={`plan-card ${isPopular ? 'popular' : ''}`}>
        {isPopular && <span className="popular-badge">Most Popular</span>}
        <span className={`plan-type-badge ${type === 'eSIM' ? 'esim' : 'physical'}`}>{type}</span>
        <h3 className="plan-title">{title}</h3>
        <div className="plan-price">{price}</div>
        <div className="plan-details">
          <div className="plan-data">Data: {dataAmount}</div>
          <div className="plan-validity">Valid for: {validity}</div>
          <div className="plan-coverage">Coverage: {coverage.join(', ')}</div>
        </div>
        <ul className="plan-features">
          {features.map((feature, index) => (
            <li key={index} className="feature-item">
              <CheckIcon className="feature-icon" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button className="select-plan-button">Select Plan</button>
      </div>
    </>
  )
}
