export const subscriptionStyles = `
  .subscription-section {
    padding: 4rem 0;
    background: #f8fafc;
  }

  .subscription-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 4rem;
  }

  .subscription-image {
    flex: 1;
  }

  .subscription-image img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .subscription-content {
    flex: 1;
  }

  .subscription-content h2 {
    font-size: 2rem;
    color: #1a1a1a;
    margin-bottom: 1rem;
  }

  .description {
    color: #666;
    margin-bottom: 1.5rem;
  }

  .price-tag {
    margin-bottom: 1.5rem;
  }

  .price {
    font-size: 2.5rem;
    font-weight: 600;
    color: #2563eb;
  }

  .period {
    color: #666;
    font-size: 1rem;
  }

  .features {
    list-style: none;
    margin-bottom: 1.5rem;
  }

  .features li {
    color: #374151;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .features li::before {
    content: "✓";
    color: #2563eb;
  }

  .note {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  .subscribe-button {
    background: #2563eb;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
  }

  .subscribe-button:hover {
    background: #1d4ed8;
  }
`
