export const planCardStyles = `
  .plan-card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: 1px solid #e5e7eb;
  }

  .plan-card.popular {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f6;
  }

  .popular-badge {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #ffffff;
    background: #3b82f6;
    border-radius: 9999px;
    align-self: flex-start;
    margin-bottom: 1rem;
  }

  .plan-title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .plan-price {
    margin-top: 1rem;
    font-size: 1.875rem;
    font-weight: 700;
  }

  .plan-details {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .plan-data {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .plan-features {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .feature-icon {
    color: #10b981;
  }

  .select-plan-button {
    margin-top: 2rem;
    width: 100%;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    background: #3b82f6;
    color: #ffffff;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .select-plan-button:hover {
    background: #2563eb;
  }
`
