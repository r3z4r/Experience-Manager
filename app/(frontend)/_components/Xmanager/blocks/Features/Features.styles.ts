export const featuresStyles = `
  .features-section {
    padding: 4rem 0;
    background: #f9fafb;
  }

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .features-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .features-title {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .features-description {
    color: #6b7280;
    max-width: 42rem;
    margin: 0 auto;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
  }

  .feature-card {
    padding: 1.5rem;
    background: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .feature-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    color: #3b82f6;
  }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .feature-description {
    color: #6b7280;
  }

  @media (min-width: 768px) {
    .features-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`
