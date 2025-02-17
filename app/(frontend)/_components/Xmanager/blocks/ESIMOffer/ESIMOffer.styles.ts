export const esimOfferStyles = `
  .esim-offer {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .offer-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .offer-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
  }

  .offer-subtitle {
    color: #6b7280;
    font-size: 1.125rem;
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .benefit-item {
    text-align: center;
  }

  .benefit-icon {
    width: 3rem;
    height: 3rem;
    color: #3b82f6;
    margin: 0 auto 1rem;
  }

  .benefit-item h3 {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .benefit-item p {
    color: #6b7280;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .plan-card {
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    transition: transform 0.2s;
  }

  .plan-card:hover {
    transform: translateY(-4px);
  }

  .plan-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
  }

  .plan-details {
    margin-bottom: 1.5rem;
  }

  .plan-details p {
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .price-section {
    margin-bottom: 1.5rem;
  }

  .original-price {
    color: #6b7280;
    text-decoration: line-through;
    margin-right: 1rem;
  }

  .discounted-price {
    color: #111827;
    font-weight: 600;
    font-size: 1.25rem;
  }

  .select-button {
    width: 100%;
    padding: 0.75rem;
    background: #3b82f6;
    color: #ffffff;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .select-button:hover {
    background: #2563eb;
  }

  .decline-button {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    color: #6b7280;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
  }

  .decline-button:hover {
    color: #374151;
  }

  @media (min-width: 640px) {
    .benefits-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 768px) {
    .plans-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`
