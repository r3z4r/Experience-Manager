export const paymentStyles = `
  .payment-container {
    max-width: 550px;
    margin: 0 auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .payment-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  .secure-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #059669;
    font-size: 0.875rem;
  }

  .lock-icon {
    width: 1rem;
    height: 1rem;
  }

  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .payment-method-option {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .payment-method-option:hover {
    border-color: #3b82f6;
  }

  .payment-method-option input[type="radio"] {
    margin-top: 0.25rem;
  }

  .payment-method-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  .payment-method-icon {
    color: #6b7280;
  }

  .payment-method-details {
    display: flex;
    flex-direction: column;
  }

  .payment-method-name {
    font-weight: 500;
    color: #111827;
  }

  .payment-method-description {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .card-details-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  .form-row {
    margin-bottom: 1.5rem;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .form-group input {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px #3b82f6;
  }

  .payment-footer {
    margin-top: 2rem;
    text-align: center;
  }

  .pay-button {
    width: 100%;
    padding: 0.875rem;
    background: #3b82f6;
    color: #ffffff;
    font-weight: 600;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .pay-button:hover {
    background: #2563eb;
  }

  .payment-disclaimer {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
`
