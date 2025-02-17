import React from 'react'
import { checkoutStepsStyles } from './CheckoutSteps.styles'

interface CheckoutStep {
  title: string
  description: string
  isActive: boolean
  isCompleted: boolean
}

interface CheckoutStepsProps {
  steps: CheckoutStep[]
  currentStep: number
}

export function CheckoutSteps({ steps, currentStep }: CheckoutStepsProps) {
  return (
    <>
      <style>{checkoutStepsStyles}</style>
      <div className="checkout-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${step.isActive ? 'active' : ''} ${step.isCompleted ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
