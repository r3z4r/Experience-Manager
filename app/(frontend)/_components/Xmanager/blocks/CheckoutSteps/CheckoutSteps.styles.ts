export const checkoutStepsStyles = `
  .checkout-steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .step.active {
    background: #f0f9ff;
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background: #e5e7eb;
    color: #4b5563;
    font-weight: 600;
  }

  .step.active .step-number {
    background: #3b82f6;
    color: #ffffff;
  }

  .step.completed .step-number {
    background: #10b981;
    color: #ffffff;
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .step-description {
    color: #6b7280;
    font-size: 0.875rem;
  }
`
