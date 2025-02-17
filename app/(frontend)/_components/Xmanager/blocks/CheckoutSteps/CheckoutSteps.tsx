import React from 'react'
import { checkoutStepsStyles } from './CheckoutSteps.styles'
import { ChevronDown } from 'lucide-react'

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
            className={`step ${step.isActive ? 'active' : ''} ${
              step.isCompleted ? 'completed' : ''
            }`}
            data-gjs-droppable="true"
          >
            <input
              type="checkbox"
              id={`step-toggle-${index}`}
              className="step-checkbox"
              defaultChecked={index < 3}
            />
            <label htmlFor={`step-toggle-${index}`} className="step-header">
              <div className="step-indicator">
                <div className="step-number">{index + 1}</div>
                <div className="step-info">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
              <ChevronDown className="toggle-icon" />
            </label>
            <div className="step-content" data-gjs-droppable="true">
              <div className="step-content-placeholder">
                Drop blocks here to customize this step
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
