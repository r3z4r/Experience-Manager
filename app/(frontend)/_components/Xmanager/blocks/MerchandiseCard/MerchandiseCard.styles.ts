export const merchandiseStyles = `
  .merch-card {
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s ease;
    max-width: 400px;
    margin: 0 auto;
  }

  .merch-card:hover {
    transform: translateY(-5px);
  }

  .merch-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .merch-content {
    padding: 1.5rem;
  }

  .merch-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }

  .merch-description {
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .merch-sizes {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .size-button {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: transparent;
    color: #64748b;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .size-button:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }

  .size-button.selected {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .merch-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
  }

  .add-to-cart {
    width: 100%;
    padding: 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .add-to-cart:hover {
    background: #2563eb;
  }
`
