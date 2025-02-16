export const ctaStyles = `
  .cta-section {
    position: relative;
    padding: 5rem 0;
    color: #ffffff;
    background-size: cover;
    background-position: center;
  }

  .cta-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);
  }

  .cta-container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
  }

  .cta-title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .cta-description {
    max-width: 42rem;
    margin: 0 auto 2rem;
    font-size: 1.125rem;
  }

  .cta-button {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: #3b82f6;
    color: #ffffff;
    font-weight: 600;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
    text-decoration: none;
  }

  .cta-button:hover {
    background: #2563eb;
  }
`
