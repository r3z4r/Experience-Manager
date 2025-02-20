import React from 'react'
import { confirmationStyles } from './ApplicationConfirmation.styles'
import { CheckCircle } from 'lucide-react'

export interface ConfirmationProps {
  cardApproved: boolean
  selectedPlan?: {
    name: string
    data: string
    price: string
  }
}

export function ApplicationConfirmation({ cardApproved, selectedPlan }: ConfirmationProps) {
  return (
    <>
      <style>{confirmationStyles}</style>
      <div className="confirmation">
        <div className="status-icon">
          <CheckCircle className="icon" />
        </div>

        <div className="confirmation-content">
          <h2 className="title">Application Submitted Successfully</h2>

          <div className="details-section">
            <h3>Credit Card Application</h3>
            <p className="status">
              {cardApproved
                ? 'Congratulations! Your application has been approved.'
                : 'Your application is being processed.'}
            </p>
          </div>

          {selectedPlan && (
            <div className="details-section">
              <h3>eSIM Plan Selected</h3>
              <div className="plan-details">
                <p className="plan-name">{selectedPlan.name}</p>
                <p className="data-amount">{selectedPlan.data}</p>
                <p className="price">{selectedPlan.price}</p>
              </div>
              <div className="instructions">
                <h4>Next Steps:</h4>
                <ol>
                  <li>Check your email for eSIM activation instructions</li>
                  <li>Follow the provided QR code to install your eSIM</li>
                  <li>Start enjoying global connectivity!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
