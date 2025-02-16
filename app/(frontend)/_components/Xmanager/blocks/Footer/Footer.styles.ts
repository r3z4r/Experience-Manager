export const footerStyles = `
  .footer {
    padding: 3rem 0;
  }

  .footer-light {
    background: #ffffff;
  }

  .footer-dark {
    background: #111827;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-brand {
    max-width: 24rem;
  }

  .footer-logo {
    height: 2rem;
    width: auto;
    margin-bottom: 1rem;
  }

  .footer-description {
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .footer-light .footer-description {
    color: #4b5563;
  }

  .footer-dark .footer-description {
    color: #9ca3af;
  }

  .footer-social {
    display: flex;
    gap: 1rem;
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .footer-light .social-link {
    color: #4b5563;
  }

  .footer-dark .social-link {
    color: #9ca3af;
  }

  .social-link:hover {
    color: #3b82f6;
  }

  .footer-column-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .footer-light .footer-column-title {
    color: #111827;
  }

  .footer-dark .footer-column-title {
    color: #ffffff;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
  }

  .footer-link {
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-light .footer-link {
    color: #4b5563;
  }

  .footer-dark .footer-link {
    color: #9ca3af;
  }

  .footer-link:hover {
    color: #3b82f6;
  }

  .footer-bottom {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid;
  }

  .footer-light .footer-bottom {
    border-color: #e5e7eb;
  }

  .footer-dark .footer-bottom {
    border-color: #374151;
  }

  .footer-copyright {
    text-align: center;
    font-size: 0.875rem;
  }

  .footer-light .footer-copyright {
    color: #6b7280;
  }

  .footer-dark .footer-copyright {
    color: #9ca3af;
  }

  @media (min-width: 768px) {
    .footer-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .footer-grid {
      grid-template-columns: 2fr repeat(3, 1fr);
    }
  }
`
