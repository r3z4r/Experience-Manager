import React from 'react'
import { creditCardFormStyles } from './CreditCardForm.styles'

export function CreditCardForm() {
  return (
    <>
      <style>{creditCardFormStyles}</style>
      <div className="card-application">
        <h2 className="form-title">Credit Card Application</h2>
        <form className="application-form">
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input type="tel" placeholder="Enter your phone number" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Employment Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Occupation</label>
                <input type="text" placeholder="Enter your occupation" />
              </div>
              <div className="form-field">
                <label>Annual Income</label>
                <input type="number" placeholder="Enter your annual income" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Travel Preferences</h3>
            <div className="form-field">
              <label>How often do you travel internationally?</label>
              <select>
                <option value="">Select frequency</option>
                <option value="rarely">Rarely (1-2 times/year)</option>
                <option value="sometimes">Sometimes (3-5 times/year)</option>
                <option value="frequently">Frequently (6+ times/year)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit Application
          </button>
        </form>
      </div>
    </>
  )
}
