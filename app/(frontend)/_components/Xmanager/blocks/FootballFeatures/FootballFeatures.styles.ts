export const featuresStyles = `
  .features-section {
    padding: 4rem 0;
    background: #f8fafc;
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
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
  }

  .features-description {
    color: #64748b;
    font-size: 1.125rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .feature-card {
    background: #ffffff;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
  }

  .feature-icon {
    width: 3rem;
    height: 3rem;
    margin: 0 auto 1.5rem;
    color: #3b82f6;
  }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
  }

  .feature-description {
    color: #64748b;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .features-grid {
      grid-template-columns: 1fr;
    }

    .features-title {
      font-size: 1.5rem;
    }

    .features-description {
      font-size: 1rem;
    }
  }
`
